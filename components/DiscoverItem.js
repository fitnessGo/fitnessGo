import React, { Component } from "react";
import WorkoutCard from "../components/WorkoutCard";
import PopUp from "./PopUp";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

class DiscoverItem extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: false };
    this._onPress = this._onPress.bind(this);
    this._onLongPress = this._onLongPress.bind(this);
  }

  _onLongPress() {
    this.setState({ selected: true });
  }

  _onPress(){
    this.setState({ selected: false });
  }

  render() {
    return (
      <WorkoutCard>
        {this.state.selected && <PopUp />}
        <TouchableOpacity onLongPress={this._onLongPress} onPress={this._onPress}>
          <Text style={styles.header}>{this.props.workout.name}</Text>
          <View style={styles.info}>
            <Text>Category: {this.props.workout.category}</Text>
            <Text>Exercise Count: {this.props.workout.count}</Text>
            <Text>Exercises: {this.props.workout.exercises}</Text>
            <Text>Time: {this.props.workout.time}</Text>
          </View>
        </TouchableOpacity>
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

export default DiscoverItem;
