import React, { useState } from "react";

import { View, Button, TextInput } from "react-native";
import styles from "../stylesheet";

import { Overlay, Text } from "react-native-elements";
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
      throw `an error occurred while adding a team member: ${err}`;
    }
  };

  return (
    <View>
      <Text h3>My Team</Text>
      {teamMemberList.map((member) => {
        return <Text>{member.name}</Text>;
      })}

      <Text> Add member:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => setNewTeamMember(text)}
          value={newTeamMember}
          placeholder="new team member username"
          style={styles.inputStyle}
          autoCapitalize="none"
        />
      </View>
      <Button onPress={() => addTeamMember(newTeamMember)} title="Add Member" />
    </View>
  );
}
