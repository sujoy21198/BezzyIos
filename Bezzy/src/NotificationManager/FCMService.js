import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'
import { error } from 'react-native-gifted-chat/lib/utils'

class FCMService {

    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
    }

    registerAppWithFCM = async () => {
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true)
        }
    }

    checkPermission = (onRegister) => {
        messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.getToken(onRegister)
                } else {
                    this.requestPermission(onRegister)
                }
            }).catch(error => {
                console.log(error)
            })
    }

    getToken = (onRegister) => {
        messaging().getToken()
        .then(fcmToken => {
            if(fcmToken){
                onRegister(fcmToken)
            }else {
                console.log("user doesnt have device token")
            }
        }).catch(error => {
            console.log(error,"Token got reected")
        })
    }

    requestPermission = (onRegister) => {
        messaging().requestPermission()
        .then(() => {
            this.getToken(onRegister)
        }).catch(error => {
            console.log(error,"Permission rejected")
        })
    }

    deleteToken = () => {
        console.log("delete token")
        messaging().deleteToken()
        .catch(error => {
            console.log("delete token error",error)
        })
    }

    createNotificationListeners = (onRegister , onNotification , onOpenNotification) => {
        //when application is running in background
        messaging()
        .onNotificationOpenedApp(remoteMessage => {
            console.log("notification caused app to open")
            if(remoteMessage){
                const notification = remoteMessage.notification
                onOpenNotification(notification)
            }
        });

        //when application is opened from a quit state
        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            console.log("notification caused this app to open")

            if(remoteMessage){
                const notification = remoteMessage.notification
                onOpenNotification(notification)
            }
        });

        //foreground state messages
        this.messageListener = messaging().onMessage(async remoteMessage => {
            console.log("a new message received ",remoteMessage)
            if(remoteMessage){
                let notification = null
                if(Platform.OS === 'ios'){
                    notification = remoteMessage.data.notification
                } else {
                    notification = remoteMessage.notification
                }
                onNotification(notification)
            }
        });

        //triggered when have new token
        messaging().onTokenRefresh(fcmToken => {
            console.log("new refresh token",fcmToken)
            onRegister(fcmToken)
        })
    }

    unRegister = () => {
        this.messageListener()
    }
}

export const fcmService = new FCMService() 