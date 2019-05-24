import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

class DiscoverItem extends Component {
  render() {
    return (
      <>
        <Text style={styles.header}>{this.props.workout.name}</Text>
        <View style={styles.info}>
          <Text>Category: {this.props.workout.category}</Text>
          <Text>Exercise Count: {this.props.workout.count}</Text>
          <Text>Exercises: {this.props.workout.exercises}</Text>
          <Text>Time: {this.props.workout.time}</Text>
        </View>
      </>
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

export default DiscoverItem;
