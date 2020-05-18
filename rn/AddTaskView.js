import React, {useState} from 'react';
import {Button} from 'react-native';
import {Task} from './schemas';
import {Overlay, Input} from 'react-native-elements';
import {styles} from './App';

export function AddTaskView({realm, partition}) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  return (
    <>
      <Overlay isVisible={overlayVisible} overlayStyle={{width: '90%'}}>
        <>
          <Input
            placeholder="New Task Name"
            style={styles.forminput}
            onChangeText={(text) => setNewTaskName(text)}
            autoFocus={true}
          />
          <Button
            title="Create"
            onPress={() => {
              setOverlayVisible(false);
              realm.write(() => {
                realm.create(
                  'Task',
                  new Task({name: newTaskName || 'New Task', partition}),
                );
              });
            }}
          />
        </>
      </Overlay>
      <Button
        title="Add Task"
        onPress={() => {
          setOverlayVisible(true);
        }}
      />
    </>
  );
}
