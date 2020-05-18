/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Realm from 'realm';
import {ObjectId} from 'bson';

AppRegistry.registerComponent(appName, () => App);
