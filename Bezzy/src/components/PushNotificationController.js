import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import PushNotification, { Importance } from 'react-native-push-notification'

const PushNotificationController = (props) => {
    
    useEffect(() => {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
                console.log('TOKEN:', token)
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: async function(notification) {
                console.log('REMOTE NOTIFICATION ==>', notification)   
                
                PushNotification.createChannel(
                    {
                        id: "123",
                        channelId: notification.channelId, 
                        channelName: "My channel", 
                        channelDescription: "A channel to categorise your notifications", 
                        playSound: false, 
                        soundName: "default", 
                        importance: Importance.HIGH, 
                        vibrate: true, 
                    },
                    (created) => console.log(`createChannel returned '${created}'`) 
                );
                PushNotification.localNotification({
                    channelId: notification.channelId,
                    title: notification.title,
                    message: notification.message,
                })
                
                if(notification.userInteraction) {            
                    let notificationData = JSON.parse(await AsyncStorage.getItem("notificationData"));
                    console.warn(notificationData);
                    if(notificationData.type === "post") {
                        props.navigation.navigate("ImagePreviewScreen", {
                            image: {post_id: notificationData.respostID}
                        });
                    } else if(notificationData.type === "chat_box_msg") {
                        props.navigation.navigate("InboxScreen", {
                            friendId: notificationData.from_userid,
                            friendName: notificationData.from_usernam,
                            friendImage: notificationData.from_userimage
                        });
                    } else {
                        props.navigation.navigate("HomeScreen")
                    }
                    PushNotification.deleteChannel(notification.channelId)
                    AsyncStorage.removeItem("notificationData")
                } else {
                    AsyncStorage.setItem("notificationData", JSON.stringify(notification.data));
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