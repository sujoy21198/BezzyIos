import React, { Component } from 'react';
import { Root } from 'native-base'
import Navigation from './src/Navigation';


export default class App extends Component {
  render() {
    return (
      <Root>
        <Navigation />
      </Root>
    )
  }
}
