import React from 'react';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ITemperatureControlProps } from '../interfaces/TemperatureControl';
import './TemperatureControl.scss';
import { TemperatureUnit } from '../interfaces/TemperatureUnit';

const TemperatureControl = (props: ITemperatureControlProps) => {
  const handleChangeTemperature = (
    adjustedTemperature: 'increment' | 'decrement',
  ) => {
    props.setAdjustedTemperature(adjustedTemperature);
  };

  const currentTemperature = props.currentTemperature
    ? convertTemperatureUnit(props.currentTemperature, props.unit)
    : 0;
  const adjustedTemperature = convertTemperatureUnit(
    props.adjustedTemperature,
    props.unit,
  );

  return (
    <div>
      <div className='CurrentTemp'>
        {currentTemperature}
        <span>{props.unit === TemperatureUnit.fahrenheit ? 'F' : 'C'}</span>
      </div>
      <div className='ControlsContainer'>
        <div className='Controls'>
          <button onClick={() => handleChangeTemperature('increment')}>
            <KeyboardArrowUpIcon className='ControlUp' />
          </button>

          <div className='SetTemp'>{adjustedTemperature}</div>
          <button onClick={() => handleChangeTemperature('decrement')}>
            <KeyboardArrowDownIcon className='ControlDown' />
          </button>
        </div>
      </div>
    </div>
  );
};

const convertTemperatureUnit = (value: number, unit: 'C' | 'F') => {
  return unit === 'C' ? value : (value * (9 / 5) + 32).toFixed(0);
};

export default TemperatureControl;
