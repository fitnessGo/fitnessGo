import React, { Component } from "react";
import WorkoutCard from "../components/WorkoutCard";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";

class DiscoverItem extends Component {
  render() {
    return (
      <WorkoutCard>
        <Menu>
          <MenuTrigger
            triggerOnLongPress={true}
            customStyles={triggerMenuTouchable}
          >
            <Text style={styles.header}>{this.props.workout.name}</Text>
            <View style={styles.info}>
              <Text>Category: {this.props.workout.category}</Text>
              <Text>Exercise Count: {this.props.workout.count}</Text>
              <Text>Exercises: {this.props.workout.exercises}</Text>
              <Text>Time: {this.props.workout.time}</Text>
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={popUpStyles}>
            <MenuOption text="Add" />
            <MenuOption>
              <Text style={{ color: "red" }}>Delete</Text>
            </MenuOption>
            <MenuOption text="Edit" />
            <MenuOption text="Share" />
          </MenuOptions>
        </Menu>
      </WorkoutCard>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    marginLeft: 10,
    marginTop: 5
  },
  header: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
    marginTop: 5
  }
});

const popUpStyles = {
  optionsContainer: {
    borderRadius: 12,
    width: 100
  }
};

const triggerMenuTouchable = { TriggerTouchableComponent: TouchableOpacity };

export default DiscoverItem;
