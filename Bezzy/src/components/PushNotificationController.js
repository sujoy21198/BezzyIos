import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import PushNotification, { Importance } from 'react-native-push-notification'

const PushNotificationController = (props) => {

    useEffect(() => {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                console.log('TOKEN:', token)
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: async function (notification) {
                console.log('REMOTE NOTIFICATION ==>', notification)
                let notificationData = JSON.parse(await AsyncStorage.getItem("notification"));

                if(notification.userInteraction) {  
                    
                    if(!notification.foreground ? notification.data.type === "post" : notificationData.type === "post") {
                        props.navigation.navigate("ImagePreviewScreen", {
                            image: {post_id: !notification.foreground ? notification.data.respostID : notificationData.respostID}
                        });
                    } else if(!notification.foreground ? notification.data.type === "chat_box_msg" : notificationData.type === "chat_box_msg") {
                        props.navigation.navigate("InboxScreen", {
                            friendId: !notification.foreground ? notification.data.from_userid : notificationData.from_userid,
                            friendName: !notification.foreground ? notification.data.from_usernam : notificationData.from_usernam,
                            friendImage: !notification.foreground ? notification.data.from_userimage : notificationData.from_userimage
                        });
                    } 
                    AsyncStorage.removeItem("notification")
                } else {
                    //AsyncStorage.setItem("notificationData", JSON.stringify(notification.data));
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