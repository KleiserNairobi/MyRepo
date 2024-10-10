/**
 * @format
 */

import React from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import App from './src/main/App';
import storeConfig from './src/store/index';

const store = storeConfig();
const AppWithRedux = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => AppWithRedux);
