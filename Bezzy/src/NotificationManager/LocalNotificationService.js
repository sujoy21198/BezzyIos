import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Platform } from 'react-native'

class LocalNotificationService {
    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log("HELLOOOOOOOOOOooooo")
            },
            onNotification: function (notification) {
                console.log("notididididididid")
                if (!notification?.data) {
                    return
                }
                notification.userInteraction = true
                onOpenNotification(Platform.OS === "ios" ? notification.data.item : notification.data)

                if (Platform.OS === 'ios') {
                    notification.finish(PushNotificationIOS.FetchResult.NoData)
                }
            },
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        })
    }

    unregister = () => {
        PushNotification.unregister()
    }

    showNotification = () => {}
}