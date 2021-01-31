import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import {
  TemperatureControl,
  HistoricalOverview,
  FanToggle,
} from '../../components';
import ThermostatToggle from '../../components/ThermostatToggle/ThermostatToggle';

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
  }),
);

const Home = () => {
  const classes = useStyles();

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
          <TemperatureControl />
        </Grid>
        <Grid item xs={6} className={classes.gridItem}>
          <HistoricalOverview />
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
