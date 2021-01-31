import React, { Component } from 'react';

interface IState {
  displayName: string;
  component?: React.Component | null;
}

const asyncComponent = (importComponent: any) =>
  class extends Component {
    state: IState = {
      displayName: 'asyncComponent',
      component: null,
    };

    componentDidMount() {
      importComponent().then((cmp: any) => {
        this.setState({ component: cmp.default });
      });
    }

    render() {
      // const C = this.state.component;

      // return C ? <C {...this.props} /> : null;
      return null;
    }
  };

export default asyncComponent;
