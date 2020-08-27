import * as React from "react";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../providers/AuthProvider";

export function Logout({ screenName }) {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  return (
    <Button
      title={`log out`}
      onPress={() => {
        signOut();
        navigation.navigate("Welcome View");
      }}
    />
  );
}
