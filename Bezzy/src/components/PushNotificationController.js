import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import PushNotification, { Importance } from 'react-native-push-notification'

const PushNotificationController = (props) => {

    useEffect(() => {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
                console.log('TOKEN:', token)

                PushNotification.createChannel(
                    {
                        id: "123",
                        channelId: "1", 
                        channelName: "My channel", 
                        channelDescription: "A channel to categorise your notifications", 
                        playSound: false, 
                        soundName: "default", 
                        importance: Importance.HIGH, 
                        vibrate: true, 
                    },
                    (created) => console.log(`createChannel returned '${created}'`) 
                );
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: async function(notification) {
                console.log('REMOTE NOTIFICATION ==>', notification)  
                

                PushNotification.localNotification({
                    channelId: notification.channelId,
                    title: notification.title,
                    message: notification.message,
                })

                if(notification.userInteraction) {  
                    props.navigation.navigate("HomeScreen")
                } else {
                    
                    // AsyncStorage.setItem("notificationData", JSON.stringify(notification.data));
                }
            },
            // Android only: GCM or FCM Sender ID
            senderID: '694046059233',
            popInitialNotification: true,
            requestPermissions: true
        })
    }, [])

    return null
}

export default PushNotificationController