import React, { useState } from "react";

import { View, Button, TextInput, Alert } from "react-native";
import styles from "../stylesheet";

import { Overlay, Text, ListItem } from "react-native-elements";

import { useAuth } from "../providers/AuthProvider";

export function ManageTeam({}) {
  const { user } = useAuth();
  const [newTeamMember, setNewTeamMember] = useState(null);
  const [teamMemberList, setTeamMemberList] = useState([]);

  const getTeam = async () => {
    try {
      const teamMembers = await user.functions.getMyTeamMembers([]);
      setTeamMemberList(teamMembers);
    } catch (err) {
      Alert.alert("An error occurred while getting team members", err);
      throw `an error occurred while getting team members: ${err}`;
    }
  };
  getTeam();

  const addTeamMember = async () => {
    try {
      const addTeamMemberResult = await user.functions.addTeamMember(
        newTeamMember
      );
      getTeam();
    } catch (err) {
      Alert.alert("An error occurred while adding a team member", err.message);
      throw `an error occurred while adding a team member: ${JSON.stringify(
        null,
        err,
        2
      )}`;
    }
  };

  const removeTeamMember = async (email) => {
    try {
      const removeTeamMemberResult = await user.functions.removeTeamMember(
        email
      );
      getTeam();
    } catch (err) {
      Alert.alert("An error occurred while removing a team member", err);
      throw `an error occurred while removing a team member: ${JSON.stringify(
        null,
        err,
        2
      )}`;
    }
  };

  const openDeleteDialogue = (member) => {
    Alert.alert("Remove the following member from your team?", member.name, [
      {
        text: "Remove",
        onPress: () => {
          removeTeamMember(member.name);
        },
      },
      { text: "cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.manageTeamWrapper}>
      <View style={styles.manageTeamTitle}>
        <Text h3>My Team</Text>
      </View>
      {teamMemberList.map((member) => (
        <ListItem
          title={member.name}
          onPress={() => openDeleteDialogue(member)}
          bottomDivider
          key={member.name}
        />
      ))}

      <Text h4> Add member:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => setNewTeamMember(text)}
          value={newTeamMember}
          placeholder="new team member username"
          style={styles.addTeamMemberInput}
          autoCapitalize="none"
        />
      </View>
      <Button onPress={() => addTeamMember(newTeamMember)} title="Add Member" />
    </View>
  );
}
