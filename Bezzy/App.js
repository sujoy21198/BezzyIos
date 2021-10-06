import React, { Component, useEffect, useState } from 'react';
import { Root } from 'native-base'
import Navigation from './src/Navigation';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { checkMultiple, PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

//GRANT PERMISSION FUNCTION
const askPermission = async () => {
  requestMultiple([
    PERMISSIONS.ANDROID.CAMERA, 
    PERMISSIONS.IOS.CAMERA
  ]).then((result) => {
      console.log(result)

      return;
  }).catch((error) => {
      console.log(error)
  })
}

const App = () => {
  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      AsyncStorage.setItem("notification", JSON.stringify(remoteMessage.data))
      PushNotification.getChannels(channelIds => {
        if(channelIds.length === 0) {
          PushNotification.createChannel({
            channelId: Date.now().toString(),
            channelName: "Channel"
          }, created => {
            PushNotification.getChannels(channelIds => {
              PushNotification.localNotification({
                channelId: channelIds[0],
                title: remoteMessage.notification.title,
                message: remoteMessage.notification.body,
              });
            })
          }) 
        } else {
          PushNotification.getChannels(channelIds => {
            PushNotification.localNotification({
              channelId: channelIds[0],
              title: remoteMessage.notification.title,
              message: remoteMessage.notification.body,
            });
          })
        }
      })
    });

    if(Platform.OS === "ios") {
      checkMultiple([
        PERMISSIONS.ANDROID.CAMERA, 
        PERMISSIONS.IOS.CAMERA
      ])
      .then((result) => {
          if (RESULTS.DENIED) {
              askPermission();
          } else if (RESULTS.GRANTED) {
              return;
          }
      })
  }
    return unsubscribe;
   }, []);

  return (
    <Root>
      <Navigation />
    </Root>
  )
}

export default App;
