import React, {useState} from 'react';
import {Button} from 'react-native';
import {Task} from './schemas';
import {Overlay, Input} from 'react-native-elements';
import {styles} from './App';

// The AddTaskView is a button for adding tasks. When the button is pressed, an
// overlay shows up to request user input for the new task name. When the
// "Create" button on the overlay is pressed, the overlay closes and the new
// task is created in the realm.
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
