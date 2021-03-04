import React, { useState, useEffect, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import {
  currentHumiditySelector,
  currentTemperatureSelector,
  startChannel,
  stopChannel,
  setAdjustedTemperature,
  getInitialThermostatControls,
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

  // const temperature =
  //   props.temperatureUnit === 'C'
  //     ? props.currentTemperature
  //     : (props.currentTemperature * (9 / 5) + 32).toFixed(0);

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
    props.getInitialThermostatControls();
  }, [props.serverStatus]);

  const changeSetTemperature = (change: 'increment' | 'decrement'): void => {
    console.log(change);
    const prevAdjustedTemperature: string = props.adjustedTemperature;
    const newAdjustedTemperature = change
      ? parseInt(prevAdjustedTemperature) + 1
      : parseInt(prevAdjustedTemperature) - 1;

    props.setAdjustedTemperature(change);

    // setState((prevState: IState) => {
    //   const prevSetTemp: number = parseInt(
    //     prevState?.temperatureControl?.setTemperature,
    //   );

    //   const newSetTemp = change ? prevSetTemp + 1 : prevSetTemp - 1;

    //   return {
    //     ...prevState,
    //     temperatureControl: {
    //       ...prevState.temperatureControl,
    //       setTemperature: newSetTemp.toString(),
    //     },
    //   };
    // });
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
          {state.temperatureView ? (
            <TemperatureControl
              currentTemperature={props.currentTemperature}
              adjustedTemperature={props.adjustedTemperature}
              currentHumidity={props.currentHumidity}
              unit={props.temperatureUnit}
              setAdjustedTemperature={changeSetTemperature}
            />
          ) : (
            <Skeleton variant='rect' className={classes.skeleton} />
          )}
        </Grid>
        <Grid item xs={6} className={classes.gridItem}>
          {state.historyView ? (
            <HistoricalOverview />
          ) : (
            <Skeleton variant='rect' className={classes.skeleton} />
          )}
        </Grid>
      </Grid>
      <Grid container className={classes.grid}>
        <Grid item xs={6}>
          <FanToggle setting={props.fanSetting} />
        </Grid>
        <Grid item xs={6}>
          <ThermostatToggle setting={props.airSetting} />
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
    getInitialThermostatControls: () =>
      dispatch(getInitialThermostatControls()),
  };
};

const mapStateToProps = (state: any) => ({
  // tasks: topTaskSelector(state),
  currentTemperature: currentTemperatureSelector(state),
  currentHumidty: currentHumiditySelector(state),
  adjustedTemperature: state.thermostatReducer.adjustedTemperature,
  temperatureUnit: state.thermostatReducer.temperatureUnit,
  fanSetting: state.thermostatReducer.fanSetting,
  airSetting: state.thermostatReducer.airSetting,
  serverStatus: state.thermostatReducer.serverStatus,
  channelStatus: state.thermostatReducer.channelStatus,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
