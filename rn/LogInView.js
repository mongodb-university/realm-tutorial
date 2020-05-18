import React, {useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {styles} from './App';
import {useAuth} from './AuthProvider';

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
          console.log(`Login pressed with ${email} ${password}`);
          setError(null);
          try {
            await logIn(email, password);
            console.log('Logged in');
          } catch (e) {
            console.error('Caught it');
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
