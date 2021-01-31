import React from 'react';
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

const Settings = () => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(['temp-unit']);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List
      subheader={<ListSubheader>Settings</ListSubheader>}
      className={classes.root}
    >
      <ListItem>
        <ListItemIcon className={classes.listItemIcon}>
          {/* <WifiIcon /> */}
          <InlineIcon icon={ThermometerIcon} className={classes.icon} />
        </ListItemIcon>
        <ListItemText
          id='switch-list-label-temp-unit'
          primary={`Temperature Unit: ${
            checked.indexOf('temp-unit') !== -1 ? 'Celcius' : 'Fahrenheit'
          }`}
        />
        <ListItemSecondaryAction>
          <Switch
            edge='end'
            onChange={handleToggle('temp-unit')}
            checked={checked.indexOf('temp-unit') !== -1}
            inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default Settings;
