import { all } from 'redux-saga/effects';
import { startStopChannel } from './modules/thermostat';

export default function* rootSaga() {
  yield all([startStopChannel()]);
}
