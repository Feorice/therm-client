import { combineReducers } from 'redux';
import thermostatReducer from './modules/thermostat';

const rootReducer = combineReducers({
  thermostatReducer,
});

export default rootReducer;
