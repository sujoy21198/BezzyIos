import React, { Component } from 'react';
import { Root } from 'native-base'
import Navigation from './src/Navigation';
import PushNotification, { Importance } from 'react-native-push-notification';
import RNFirebase from 'react-native-firebase';

const configOptions = {
  debug: true,
  promptOnMissingPlayServices: true
}

export const firebase = RNFirebase.initializeApp(configOptions);

export default class App extends Component {
  render() {
    return (
      <Root>
        <Navigation />
      </Root>
    )
  }
}
