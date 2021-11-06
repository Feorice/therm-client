import { io, Socket } from 'socket.io-client';
import { eventChannel, EventChannel } from 'redux-saga';
import {
  take,
  call,
  put,
  fork,
  race,
  cancelled,
  delay,
  all,
} from 'redux-saga/effects';

const START_CHANNEL = 'START_CHANNEL';
const STOP_CHANNEL = 'STOP_CHANNEL';
const CHANNEL_ON = 'CHANNEL_ON';
const CHANNEL_OFF = 'CHANNEL_OFF';
const SERVER_ON = 'SERVER_ON';
const SERVER_OFF = 'SERVER_OFF';
const UPDATE_THERMOSTAT_METRICS = 'UPDATE_THERMOSTAT_METRICS';
const SET_ADJUSTED_TEMPERATURE = 'SET_ADJUSTED_TEMPERATURE';
const UPDATE_THERMOSTAT_SETTINGS = 'UPDATE_THERMOSTAT_SETTINGS';
const SET_TEMPERATURE_UNIT = 'SET_TEMPERATURE_UNIT';
const GET_INITIAL_THERMOSTAT_SETTINGS = 'GET_INITIAL_THERMOSTAT_SETTINGS';
const SET_FAN_SETTING = 'SET_FAN_SETTING';
const SET_AIR_SETTING = 'SET_AIR_SETTING';
const socketServerURL = 'http://192.168.1.102:8080';

const initialState = {
  channelStatus: 'off',
  serverStatus: 'unknown',
  thermostatMetrics: {},
  thermostatSettings: {},
  currentHumidity: 0,
  currentTemperature: 0,
  adjustedTemperature: 50,
  temperatureUnit: 'C',
  fanSetting: 'auto',
  airSetting: 'off',
};

// Move to reducer?
export default (
  state = initialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case CHANNEL_ON:
      return { ...state, channelStatus: 'on' };
    case CHANNEL_OFF:
      return { ...state, channelStatus: 'off', serverStatus: 'unknown' };
    case SERVER_OFF:
      return { ...state, serverStatus: 'off' };
    case SERVER_ON:
      return { ...state, serverStatus: 'on' };
    case UPDATE_THERMOSTAT_METRICS:
      return { ...state, ...action.payload };
    case UPDATE_THERMOSTAT_SETTINGS:
      return { ...state, ...action.payload };
    case SET_FAN_SETTING:
      return { ...state, ...action.payload };
    case SET_AIR_SETTING:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// action creators. You can also put them into componentDidMount (what?)
export const startChannel = () => ({ type: START_CHANNEL });

export const stopChannel = () => ({ type: STOP_CHANNEL });

export const setAdjustedTemperature = (change: 'increment' | 'decrement') => {
  socket.emit('setAdjustedTemperature', { change });
  return { type: SET_ADJUSTED_TEMPERATURE };
};

export const setTemperatureUnit = (unit: 'C' | 'F') => {
  socket.emit('setTemperatureUnit', { unit });
  return { type: SET_TEMPERATURE_UNIT };
};

export const getInitialThermostatSettings = () => {
  socket.emit('getInitialThermostatSettings', {});
  return { type: GET_INITIAL_THERMOSTAT_SETTINGS };
};

export const setFanSetting = (fanSetting: 'on' | 'auto') => {
  socket.emit('setSettings', { fanSetting });
  return { type: SET_FAN_SETTING };
};

export const setAirSetting = (airSetting: 'ac' | 'off' | 'heat') => {
  socket.emit('setSettings', { airSetting });
  return { type: SET_AIR_SETTING };
};

export const currentTemperatureSelector = (state: any) =>
  state.thermostatReducer.currentTemperature;

export const currentHumiditySelector = (state: any) =>
  state.thermostatReducer.currentHumidity;

// wrapping functions for socket events (connect, disconnect, reconnect)
let socket: Socket;

const connect = () => {
  socket = io(socketServerURL);

  return new Promise((resolve) => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
};

const disconnect = () => {
  socket = io(socketServerURL);

  return new Promise((resolve) => {
    socket.on('disconnect', () => {
      resolve(socket);
    });
  });
};

const reconnect = () => {
  socket = io(socketServerURL);

  return new Promise((resolve) => {
    socket.on('reconnect', () => {
      resolve(socket);
    });
  });
};

// This is how channel is created.
// This can be expanded out into multiple channels
// when we decide to expand the app's functionality.
// Maybe create a factory or some sort of manager for
// starting and stopping channels as needed.
const createThermostatMetricsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    const handler = (data: unknown) => {
      emit(data);
    };

    socket.on('updateThermostatMetrics', handler);

    return () => {
      socket.off('updateThermostatMetrics', handler);
    };
  });

// This sets up a channel to receive temperature and humidity updates from backend.
const createThermostatSettingsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    const handler = (data: unknown) => emit(data);

    // channels.forEach((channel) => socket.on(channel, handler));

    socket.on('updateThermostatSettings', handler);
    socket.on('respondInitialThermostatSettings', handler);

    return () => {
      // channels.forEach((channel) => socket.off(channel, handler));
      socket.off('updateThermostatSettings', handler);
      socket.off('respondInitialThermostatSettings', handler);
    };
  });

// connection monitoring sagas
const listenDisconnectSaga = function* () {
  while (true) {
    yield call(disconnect);
    yield put({ type: SERVER_OFF });
  }
};

const listenConnectSaga = function* () {
  while (true) {
    yield call(reconnect);
    yield put({ type: SERVER_ON });
  }
};

// Saga to switch on channel.
const listenServerSaga = function* (): Generator<any, any, any> {
  try {
    yield put({ type: CHANNEL_ON });

    const { timeout } = yield race({
      connected: call(connect),
      timeout: delay(2000),
    });

    if (timeout) {
      yield put({ type: SERVER_OFF });
    }

    const socket: Socket = yield call(connect);
    const thermostatMetricsSocketChannel: EventChannel<unknown> = yield call(
      createThermostatMetricsChannel,
      socket,
    );

    // const thermostatControlChannels = [
    //   'updateThermostatSettings',
    //   'respondInitialThermostatSettings',
    // ];
    const thermostatSettingsSocketChannel: EventChannel<unknown> = yield call(
      createThermostatSettingsChannel,
      socket,
      // thermostatControlChannels,
    );

    yield all([fork(listenDisconnectSaga), fork(listenConnectSaga)]);
    yield put({ type: SERVER_ON });

    yield all([
      fork(function* () {
        while (true) {
          const thermostatMetricsPayload: any = yield take(
            thermostatMetricsSocketChannel,
          );

          yield put({
            type: UPDATE_THERMOSTAT_METRICS,
            payload: thermostatMetricsPayload,
          });
        }
      }),
      fork(function* () {
        while (true) {
          const thermostatSettingsPayload: any = yield take(
            thermostatSettingsSocketChannel,
          );

          yield put({
            type: UPDATE_THERMOSTAT_SETTINGS,
            payload: thermostatSettingsPayload,
          });
        }
      }),
    ]);
  } catch (error) {
    console.log(error);
  } finally {
    if (yield cancelled()) {
      socket.disconnect();
      yield put({ type: CHANNEL_OFF });
    }
  }
};

// saga listens for start and stop actions
export const startStopChannel = function* () {
  while (true) {
    yield take(START_CHANNEL);
    yield race({
      task: call(listenServerSaga),
      cancel: take(STOP_CHANNEL),
    });
  }
};
