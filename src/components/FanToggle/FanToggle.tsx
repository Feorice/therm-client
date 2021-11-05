import React from 'react';
import AutoIcon from '@material-ui/icons/Autorenew';
import FanIcon from '@material-ui/icons/ToysOutlined';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const FanToggle = (props: any) => {
  const fanSetting = props.setting;

  // Probably get rid of this with full Redux implementation...
  const [alignment, setAlignment] = React.useState(fanSetting);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment !== null) {
      console.log(newAlignment);
      props.setFanSetting({ fanSetting: newAlignment });
      setAlignment(newAlignment);
    }
  };

  return (
    <Grid container direction='row' alignItems='center' justify='center'>
      <Grid item>
        <ToggleButtonGroup
          size='large'
          value={alignment}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value='on'>
            <FanIcon />
          </ToggleButton>
          <ToggleButton value='auto'>
            <AutoIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default FanToggle;
