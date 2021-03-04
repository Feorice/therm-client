import { TemperatureUnit } from './TemperatureUnit';

export interface ITemperatureControl {
  unit: TemperatureUnit;
  currentTemperature: number;
  adjustedTemperature: number;
  currentHumidity: number;
}

export interface IChangeSetTemperature {
  (change: 'increment' | 'decrement'): void;
}

export interface ITemperatureControlProps extends ITemperatureControl {
  setAdjustedTemperature: IChangeSetTemperature;
}
