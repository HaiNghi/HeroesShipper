import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';

const configure = () => {
    PushNotification.configure({
    onRegister: (token) => {
        //process token

        console.log('TOKEN:', token); 
    },
    onNotification: (notification, navigation) => {
        console.log('NOTIFICATION:', notification);
        // process the notification
        // required on iOS only
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    popInitialNotification: true,
    requestPermissions: true,

    });
    return PushNotification;
};

 
export {
    configure,
};
