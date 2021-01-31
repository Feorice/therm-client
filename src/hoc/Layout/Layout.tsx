import React from 'react';
import Paper from '@material-ui/core/Paper';
import { NavigationBar } from '../../components';

import './Layout.scss';

interface IProps {
  children?: any;
}

const AppLayout = (props: IProps = { children: <div /> }): any => (
  <div className='Layout'>
    <Paper>
      <NavigationBar />
      <main>{props.children}</main>
    </Paper>
  </div>
);

export default AppLayout;
