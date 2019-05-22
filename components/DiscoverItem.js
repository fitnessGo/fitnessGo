//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

// create a component
class DiscoverItem extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{this.props.workout.name}</Text>
        <View style={styles.info}>
          <Text>Category: {this.props.workout.category}</Text>
          <Text>Exercise Count: {this.props.workout.count}</Text>
          <Text>Exercises: {this.props.workout.exercises}</Text>
          <Text>Time: {this.props.workout.time}</Text>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 12,
    height: 130,
    marginTop: 20,
    width: "45%"
  },
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

//make this component available to the app
export default DiscoverItem;
