import { io, Socket } from 'socket.io-client';
import { eventChannel } from 'redux-saga';
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
// import { createSelector } from 'reselect';

// const ADD_TASK = 'ADD_TASK';
const START_CHANNEL = 'START_CHANNEL';
const STOP_CHANNEL = 'STOP_CHANNEL';
const CHANNEL_ON = 'CHANNEL_ON';
const CHANNEL_OFF = 'CHANNEL_OFF';
const SERVER_ON = 'SERVER_ON';
const SERVER_OFF = 'SERVER_OFF';
const UPDATE_THERMOSTAT_METRICS = 'UPDATE_THERMOSTAT_METRICS';
const SET_ADJUSTED_TEMPERATURE = 'SET_ADJUSTED_TEMPERATURE';
const UPDATE_THERMOSTAT_CONTROLS = 'UPDATE_THERMOSTAT_CONTROLS';
const SET_TEMPERATURE_UNIT = 'SET_TEMPERATURE_UNIT';
const GET_INITIAL_THERMOSTAT_CONTROLS = 'GET_INITIAL_THERMOSTAT_CONTROLS';
const socketServerURL = 'http://192.168.1.102:8080';

const initialState = {
  // taskList: [], // Remove
  channelStatus: 'off',
  serverStatus: 'unknown',
  currentHumidity: 0,
  currentTemperature: 0,
  adjustedTemperature: 50,
  temperatureUnit: 'F', // Switch back to celcius when settings get implemented.
  fanSetting: 'auto',
  airSetting: 'off',
};

// Move to reducer?
export default (
  state = initialState,
  action: { type: string; payload: any },
) => {
  // const { taskList } = state;
  // const updatedTaskList = [...taskList, action.payload];

  switch (action.type) {
    case CHANNEL_ON:
      return { ...state, channelStatus: 'on' };
    case CHANNEL_OFF:
      return { ...state, channelStatus: 'off', serverStatus: 'unknown' };
    // case ADD_TASK:
    //   return { ...state, taskList: updatedTaskList };
    case SERVER_OFF:
      return { ...state, serverStatus: 'off' };
    case SERVER_ON:
      return { ...state, serverStatus: 'on' };
    case UPDATE_THERMOSTAT_METRICS:
      return { ...state, ...action.payload };
    case UPDATE_THERMOSTAT_CONTROLS:
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
export const getInitialThermostatControls = () => {
  socket.emit('getInitialThermostatControls', { blah: '1' });
  return { type: GET_INITIAL_THERMOSTAT_CONTROLS };
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

const createThermostatControlsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    const handler = (data: unknown) => {
      emit(data);
    };

    socket.on('updateThermostatControls', handler);
    socket.on('respondInitialThermostatControls', handler);

    return () => {
      socket.off('updateThermostatControls', handler);
      socket.off('respondInitialThermostatControls', handler);
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
const listenServerSaga = function* () {
  try {
    yield put({ type: CHANNEL_ON });

    const { timeout } = yield race({
      connected: call(connect),
      timeout: delay(2000),
    });

    if (timeout) {
      yield put({ type: SERVER_OFF });
    }

    const socket = yield call(connect);
    const thermostatMetricsSocketChannel = yield call(
      createThermostatMetricsChannel,
      socket,
    );
    const thermostatControlsSocketChannel = yield call(
      createThermostatControlsChannel,
      socket,
    );

    yield all([fork(listenDisconnectSaga), fork(listenConnectSaga)]);
    yield put({ type: SERVER_ON });

    yield all([
      fork(function* () {
        while (true) {
          const thermostatMetricsPayload = yield take(
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
          const thermostatControlsPayload = yield take(
            thermostatControlsSocketChannel,
          );

          yield put({
            type: UPDATE_THERMOSTAT_CONTROLS,
            payload: thermostatControlsPayload,
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
