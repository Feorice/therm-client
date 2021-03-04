import React from 'react';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

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

export default withRouter(connect(null)(App));
