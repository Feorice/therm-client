import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import { Home, Settings } from './containers';
import { Layout } from './hoc';

function App() {
  return (
    <div className='App'>
      <Layout>
        <Switch>
          <Route path='/settings' component={Settings} />
          <Route path='/' component={Home} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
