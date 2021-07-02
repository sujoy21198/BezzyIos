import React, { Component, useEffect, useState } from 'react';
import { Root } from 'native-base'
import Navigation from './src/Navigation';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification"
import AsyncStorage from '@react-native-async-storage/async-storage';

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const App = () => {
  useEffect(() => {
    requestUserPermission();
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage,
            );
        }
      });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      AsyncStorage.setItem("notification", JSON.stringify(remoteMessage.data))
      PushNotification.localNotification({
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
      });
    });

    return unsubscribe;
   }, []);

  return (
    <Root>
      <Navigation />
    </Root>
  )
}

export default App;
