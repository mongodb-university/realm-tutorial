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
    const authedUser = await signIn(username, password);

    const config = {
      sync: {
        user: authedUser,
        partitionValue: `user=${authedUser.id}`,
      },
    };
    const userRealm = await Realm.open(config);
    navigation.navigate("Project List", { userRealm });
  };

  const onPressSignUp = async () => {
    const signUpResult = await signUp(username, password);
    onPressSignIn();
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
