import React, { ChangeEvent, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import { InlineIcon } from '@iconify/react';
import ThermometerIcon from '@iconify/icons-mdi/thermometer-low';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
  setTemperatureUnit,
  getInitialThermostatControls,
  startChannel,
  stopChannel,
} from '../../redux/modules/thermostat';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    listItemIcon: {
      minWidth: '40px',
    },
    icon: {
      fontSize: '1.5em',
    },
  }),
);

const Settings = (props: any) => {
  const classes = useStyles();

  const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
    props.setTemperatureUnit(event.target.checked ? 'C' : 'F');
  };

  useEffect(() => {
    props.startChannel();

    () => props.stopChannel();
  }, []);

  useEffect(() => {
    props.getInitialThermostatControls();
  }, [props.serverStatus]);

  return (
    <List
      subheader={<ListSubheader>Settings</ListSubheader>}
      className={classes.root}
    >
      <ListItem>
        <ListItemIcon className={classes.listItemIcon}>
          <InlineIcon icon={ThermometerIcon} className={classes.icon} />
        </ListItemIcon>
        <ListItemText
          id='switch-list-label-temp-unit'
          primary={`Temperature Unit: ${
            props.temperatureUnit === 'C' ? 'Celcius' : 'Fahrenheit'
          }`}
        />
        <ListItemSecondaryAction>
          <Switch
            edge='end'
            onChange={handleToggle}
            checked={props.temperatureUnit === 'C' ? true : false}
            inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  startChannel: () => dispatch(startChannel()),
  stopChannel: () => dispatch(stopChannel()),
  setTemperatureUnit: (unit: 'C' | 'F') => dispatch(setTemperatureUnit(unit)),
  getInitialThermostatControls: () => dispatch(getInitialThermostatControls()),
});

const mapStateToProps = (state: any) => ({
  temperatureUnit: state.thermostatReducer.temperatureUnit,
  serverStatus: state.thermostatReducer.serverStatus,
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
