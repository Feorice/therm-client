import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import {
  TemperatureControl,
  HistoricalOverview,
  FanToggle,
} from '../../components';
import ThermostatToggle from '../../components/ThermostatToggle/ThermostatToggle';
import Skeleton from '@material-ui/lab/Skeleton';

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
  historyView?: boolean;
  temperatureView?: boolean;
}

const Home = () => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    historyView: false,
    temperatureView: false,
  });

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

  return (
    <>
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
            <TemperatureControl />
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
          <FanToggle />
        </Grid>
        <Grid item xs={6}>
          <ThermostatToggle />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
