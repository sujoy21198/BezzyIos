import React, { Component } from 'react';
import { Root } from 'native-base'
import Navigation from './src/Navigation';
import messaging from '@react-native-firebase/messaging';

//const configOptions = {
  //debug: true,
 // promptOnMissingPlayServices: true,
  //apiKey: "AIzaSyCTFNYbdYcGIMBiV8u5wN8rxjhEH4jk6Ms", 
 // appId: "1:694046059233:ios:885204988f61b3b92d65a0",
  //databaseURL: "https://bezzy-applicatio-1603700126875.firebaseio.com/",
  //messagingSenderId: "694046059233",
  //projectId: "bezzy-applicatio-1603700126875",
  //storageBucket: "bezzy-applicatio-1603700126875.appspot.com"
//}

//export const firebase = RNFirebase.initializeApp(configOptions);

export default class App extends Component {

  async componentDidMount () {
    const cloudMessagePermission = await messaging.AuthorizationStatus;
    const authorizationStatus = await messaging().requestPermission();
      if (authorizationStatus === cloudMessagePermission.AUTHORIZED) {
        console.log('Permission status:', authorizationStatus);
      } else {
        await messaging().requestPermission({provisional: true})
      }
  }

  render() {
    return (
      <Root>
        <Navigation />
      </Root>
    )
  }
}
