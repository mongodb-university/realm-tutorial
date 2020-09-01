import React, { useState } from "react";
import Realm from "realm";
import { View, Text, TextInput, Button } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import styles from "../stylesheet";

export function WelcomeView({ navigation, route }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, signIn } = useAuth();
  const onPressSignIn = async () => {
    try {
      const authedUser = await signIn(username, password);

      const config = {
        sync: {
          user: authedUser,
          partitionValue: `user=${authedUser.id}`,
        },
      };
      const userRealm = await Realm.open(config);
      navigation.navigate("Projects", { userRealm });
    } catch (err) {
      throw `an error occurred while signing in ${err}`;
    }
  };

  const onPressSignUp = async () => {
    await signUp(username, password);
    setTimeout(() => {
      onPressSignIn();
    }, 3000); // 3 second timeout to allow for realm to receive the user object, so the next screen can retrieve it via  userRealm.objects("User");
  };
  return (
    <View>
      <Text>Signup or Signin:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="username"
          style={styles.inputStyle}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="password"
          style={styles.inputStyle}
          secureTextEntry
        />
      </View>
      <Button onPress={onPressSignIn} title="Sign In" />
      <Button onPress={onPressSignUp} title="Sign Up" />
    </View>
  );
}
