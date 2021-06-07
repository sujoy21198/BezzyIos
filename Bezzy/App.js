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
  componentDidMount() {
    PushNotification.createChannel(
      {
        channelId: "1", // (required)
        channelName: "Default Channel", // (required)
        channelDescription: "Default Channel", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }
  render() {
    return (
      <Root>
        <Navigation />
      </Root>
    )
  }
}
