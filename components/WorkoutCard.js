import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

class WorkoutCard extends Component {
  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 12,
    height: 130,
    marginTop: 20,
    width: "45%"
  }
});

export default WorkoutCard;
