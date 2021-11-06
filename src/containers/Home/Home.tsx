import React, { useState, useEffect, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import {
  // currentHumiditySelector,
  currentTemperatureSelector, // Do we need these selectors? Maybe for conversions at some point?
  startChannel,
  stopChannel,
  setAdjustedTemperature,
  getInitialThermostatSettings,
  setFanSetting,
  setAirSetting,
} from '../../redux/modules/thermostat';

import {
  TemperatureControl,
  HistoricalOverview,
  FanToggle,
} from '../../components';
import ThermostatToggle from '../../components/ThermostatToggle/ThermostatToggle';
import Skeleton from '@material-ui/lab/Skeleton';

import { Dispatch } from 'redux';

const useStyles = makeStyles(() =>
  createStyles({
    grid: {
      marginTop: '10px',
      justify: 'center',
      alignItems: 'center',
    },
    gridItem: {
      textAlign: 'center',
    },
    inline: {
      display: 'inline',
    },
    skeleton: {
      margin: '10px',
      height: '148px',
    },
  }),
);

interface IState {
  historyView: boolean;
  temperatureView: boolean;
}

const Home = (props: any) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    historyView: false,
    temperatureView: false,
  });

  // For skeleton crew...
  useEffect(() => {
    setTimeout(() => {
      setState((prevState: IState) => ({
        ...prevState,
        historyView: true,
      }));
    }, 1000);
    setTimeout(() => {
      setState((prevState: IState) => ({
        ...prevState,
        temperatureView: true,
      }));
    }, 1500);
  }, []);

  useEffect(() => {
    props.startChannel();

    () => props.stopChannel();
  }, []);

  useEffect(() => {
    props.getInitialThermostatSettings();
  }, [props.serverStatus]);

  const onSetTemperature = (change: 'increment' | 'decrement'): void => {
    props.setAdjustedTemperature(change);
  };

  const onFanChange = (setting: 'on' | 'auto') => {
    props.setFanSetting(setting);
  };

  const onAirChange = (setting: 'ac' | 'off' | 'heat') => {
    props.setAirSetting(setting);
  };

  return (
    <Fragment>
      <Grid container direction='row' className={classes.grid}>
        <Grid item xs={12} className={classes.gridItem}>
          <Typography
            component='span'
            variant='h6'
            className={classes.inline}
            color='textPrimary'
          >
            10:30 AM / 01-30-2021
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction='row' className={classes.grid}>
        <Grid item xs={6} className={classes.gridItem}>
          {props.serverStatus === 'on' ? (
            <TemperatureControl
              currentTemperature={props.currentTemperature}
              adjustedTemperature={props.adjustedTemperature}
              currentHumidity={props.currentHumidity}
              unit={props.temperatureUnit}
              setAdjustedTemperature={onSetTemperature}
            />
          ) : (
            <Skeleton variant='rect' className={classes.skeleton} />
          )}
        </Grid>
        <Grid item xs={6} className={classes.gridItem}>
          {props.serverStatus === 'on' ? (
            <HistoricalOverview />
          ) : (
            <Skeleton variant='rect' className={classes.skeleton} />
          )}
        </Grid>
      </Grid>
      <Grid container className={classes.grid}>
        <Grid item xs={6}>
          <FanToggle setting={props.fanSetting} setFanSetting={onFanChange} />
        </Grid>
        <Grid item xs={6}>
          <ThermostatToggle
            setting={props.airSetting}
            setAirSetting={onAirChange}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    startChannel: () => dispatch(startChannel()),
    stopChannel: () => dispatch(stopChannel()),
    setAdjustedTemperature: (change: 'increment' | 'decrement') =>
      dispatch(setAdjustedTemperature(change)),
    getInitialThermostatSettings: () =>
      dispatch(getInitialThermostatSettings()),
    setFanSetting: (setting: 'on' | 'auto') => {
      dispatch(setFanSetting(setting));
    },
    setAirSetting: (setting: 'ac' | 'off' | 'heat') => {
      dispatch(setAirSetting(setting));
    },
  };
};

const mapStateToProps = (state: any) => ({
  currentTemperature: currentTemperatureSelector(state),
  // currentHumidty: currentHumiditySelector(state),
  currentHumidity: state.thermostatReducer.currentHumidity,
  adjustedTemperature: state.thermostatReducer.adjustedTemperature,
  temperatureUnit: state.thermostatReducer.temperatureUnit,
  fanSetting: state.thermostatReducer.fanSetting,
  airSetting: state.thermostatReducer.airSetting,
  serverStatus: state.thermostatReducer.serverStatus,
  channelStatus: state.thermostatReducer.channelStatus,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
