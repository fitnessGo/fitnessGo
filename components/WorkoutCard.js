import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

class WorkoutCard extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    shadowColor: 'black',
    shadowRadius: 6,
    shadowOpacity: 0.2
  }
});

export default WorkoutCard;
