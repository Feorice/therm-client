import React from 'react';
// import { Paper } from "@material-ui/core";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import './TemperatureControl.scss';

const TemperatureControl = () => (
  <div>
    <div className='CurrentTemp'>
      70
      <span>C</span>
    </div>
    <div className='ControlsContainer'>
      <div className='Controls'>
        <KeyboardArrowUpIcon className='ControlUp' />
        <div className='SetTemp'>100</div>
        <KeyboardArrowDownIcon className='ControlDown' />
      </div>
    </div>
  </div>
);

export default TemperatureControl;
