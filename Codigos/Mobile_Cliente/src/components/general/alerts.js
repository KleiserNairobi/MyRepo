import React from 'react';
import { Alert, ToastAndroid, Platform, BackHandler } from 'react-native';

export const NotificationAlert = (msg, title) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.LONG);
    } else {
        if (title) {
            Alert.alert(title, msg);
        } else {
            Alert.alert('Aviso', msg);
        }
    }
}

export const ConfirmAlert = (func, msg = null, title = null) => {
    title = (title) ? title : 'Confirmação';
    msg = (msg) ? msg : 'Deseja realmente fazer essa operação?';

    Alert.alert(title, msg, [
        {
            text: "NÃO",
            onPress: () => func(false),
            style: "cancel"
        },
        { 
            text: "SIM", 
            onPress: () => func(true)
        }
    ]);

    return true;
}

export const ExitAlert = (msg, title = null) => {
    title = (title) ? title : 'Sair';
    msg = (msg) ? msg : 'Deseja realmente sair do aplicativo?';

    Alert.alert(title, msg, [
        {
            text: "NÃO",
            onPress: () => null,
            style: "cancel"
        },
        { 
            text: "SIM", 
            onPress: () => BackHandler.exitApp()
        }
    ]);
    return true;
}

export default NotificationAlert;