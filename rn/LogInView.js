import React, {useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {styles} from './styles';
import {useAuth} from './AuthProvider';

// This view has an input for email and password and logs in the user when the
// "log in" button is pressed.
export function LogInView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const {logIn} = useAuth();
  return (
    <>
      <Text style={styles.header}>Login</Text>
      <View style={styles.forminput}>
        <TextInput
          autoCapitalize="none"
          placeholder="email"
          style={styles.forminput}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.forminput}>
        <TextInput
          secureTextEntry={true}
          placeholder="password"
          onChangeText={setPassword}
        />
      </View>
      <Button
        onPress={async () => {
          console.log(
            `Log in button pressed with email ${email} and password ${password}`,
          );
          setError(null);
          try {
            await logIn(email, password);
          } catch (e) {
            setError(e);
          }
        }}
        title="Login"
        color="#841584"
      />
      <Text>{error}</Text>
    </>
  );
}
