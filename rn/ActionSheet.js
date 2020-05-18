import React from 'react';
import {ListItem, Overlay} from 'react-native-elements';
export function ActionSheet({actions, visible, closeOverlay}) {
  console.log('Actions:', actions);
  return (
    <Overlay
      overlayStyle={{width: '90%'}}
      isVisible={visible}
      onBackdropPress={closeOverlay}>
      <>
        {actions.map(({title, action}) => (
          <ListItem
            key={title}
            title={title}
            onPress={() => {
              closeOverlay();
              action();
            }}
          />
        ))}
      </>
    </Overlay>
  );
}
