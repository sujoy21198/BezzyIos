import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import PushNotification, { Importance } from 'react-native-push-notification'
import messaging from '@react-native-firebase/messaging';

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

                messaging().onNotificationOpenedApp(remoteMessage => {
                    console.log(
                    'Notification caused app to open from background state:',
                    remoteMessage,
                    );
                    if(remoteMessage.data.type === "post") {
                        props.navigation.navigate("ImagePreviewScreen", {
                            image: {post_id:  remoteMessage.data.respostID}
                        });
                    } else if(remoteMessage.data.type === "chat_box_msg") {
                        props.navigation.navigate("InboxScreen", {
                            friendId: remoteMessage.data.from_userid,
                            friendName: remoteMessage.data.from_usernam,
                            friendImage: remoteMessage.data.from_userimage
                        });
                    } else {
                        props.navigation.navigate("HomeScreen")
                    }
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
                            if(remoteMessage.data.type === "post") {
                                props.navigation.navigate("ImagePreviewScreen", {
                                    image: {post_id:  remoteMessage.data.respostID}
                                });
                            } else if(remoteMessage.data.type === "chat_box_msg") {
                                props.navigation.navigate("InboxScreen", {
                                    friendId: remoteMessage.data.from_userid,
                                    friendName: remoteMessage.data.from_usernam,
                                    friendImage: remoteMessage.data.from_userimage
                                });
                            } else {
                                props.navigation.navigate("HomeScreen")
                            }
                        }
                    });
                let notificationData = JSON.parse(await AsyncStorage.getItem("notification")) || [];

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
                    } else {
                        props.navigation.navigate("HomeScreen")
                    }
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