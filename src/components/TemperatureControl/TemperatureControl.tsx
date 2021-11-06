import React from 'react';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ITemperatureControlProps } from '../interfaces/TemperatureControl';
import './TemperatureControl.scss';
import { TemperatureUnit } from '../interfaces/TemperatureUnit';
import IconButton from '@material-ui/core/IconButton';

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

  const currentHumidity = props.currentHumidity;

  return (
    <div>
      <div className='CurrentTemp'>
        {currentTemperature}
        <span>{props.unit === TemperatureUnit.fahrenheit ? 'F' : 'C'}</span>
      </div>
      {/* <div>Humidity: {currentHumidity}</div> */}
      <div className='ControlsContainer'>
        <div className='Controls'>
          <IconButton onClick={() => handleChangeTemperature('increment')}>
            <KeyboardArrowUpIcon className='ControlUp' />
          </IconButton>
          <div className='SetTemp'>{adjustedTemperature}</div>
          <IconButton onClick={() => handleChangeTemperature('decrement')}>
            <KeyboardArrowDownIcon className='ControlDown' />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

// In hindsight, this is stupid. Do something else. We won't get accurate adjustments this way.
const convertTemperatureUnit = (value: number, unit: 'C' | 'F') => {
  // return unit === 'C'
  //   ? ((value - 32) / (9 / 5)).toFixed(0)
  //   : (value * (9 / 5) + 32).toFixed(0);
  return value;
};

export default TemperatureControl;
