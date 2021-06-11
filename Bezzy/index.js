/**
 * @format
 */

import { useRef } from 'react';
import {AppRegistry, AppState} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
