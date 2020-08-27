import React, { useState } from "react";

import { StyleSheet, Text, View } from "react-native";

export function TasksView({ navigation, route }) {
  const { name } = route.params;
  return (
    <View>
      <Text>View the tasks for {name}:</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
