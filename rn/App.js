/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
const ObjectId = require('bson').ObjectId;
import Realm from 'realm';
import {AuthProvider, useAuth} from './AuthProvider';

function getApp() {
  const appId = 'myrealmapp-vjmee';
  const appConfig = {
    id: appId,
    url: 'https://realm-dev.mongodb.com', //'http://localhost:8080',
    timeout: 1000,
    app: {
      name: 'default',
      version: '0',
    },
  };
  return new Realm.App(appConfig);
}

const partition = 'My Project';
export const TaskSchema = {
  name: 'Task',
  properties: {
    _id: 'object id',
    _partition: 'string',
    name: 'string?',
    status: 'string',
  },
  primaryKey: '_id',
};
const rApp = getApp();

const App = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    console.log('effect called');
    const creds = Realm.Credentials.anonymous();
    rApp
      .logIn(creds)
      .then((res) => {
        console.log(JSON.stringify(res));
        setUser(res);
      })
      .catch(console.dir);
  }, []);
  let [tasks, setTasks] = useState([]);
  useEffect(() => {
    if (!user) {
      return;
    }
    const config = {
      schema: [TaskSchema],
      sync: {
        user,
        partitionValue: `"${partition}"`, // "myPartition"
      },
    };
    Realm.open(config)
      .then((realm) => {
        console.log('realm open called');
        realm.syncSession.downloadAllServerChanges();
        let syncTasks = realm.objects('Task');
        console.log('syncTasks', syncTasks);
        listener = realm.addListener('change', () => {
          console.log('Changed');
          setTasks([...syncTasks]);
        });
        setTasks([...syncTasks]);
      })
      .catch(console.dir);
    console.log(`Opened Realm ${partition} for user ${user.identity}`);
  }, [user]);
  console.log('Length:', tasks.length);
  return (
    <AuthProvider>
      <AuthTest />
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text>Begin Tasks</Text>
              {tasks.map((task) => (
                <Text key={task.name}>{task.name}</Text>
              ))}
              <Text>End Tasks</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthProvider>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
export default App;
