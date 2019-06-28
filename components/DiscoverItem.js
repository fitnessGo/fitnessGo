import React, { Component } from "react";
import WorkoutCard from "../components/WorkoutCard";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { FontStyles } from '../styles/global';

class DiscoverItem extends Component {
  render() {
    let textStyle;
    if (this.props.style != undefined) {
      textStyle = { color: this.props.style.color }
    }
    //Calc workout total duration
    var totalDurationSec = 0;
    this.props.workout.exercises.map(exercise => {
      exercise.exerciseSets.map(set => {
          totalDurationSec += set.duration
          totalDurationSec += isNaN(set.break) ? 0 : set.break
      })
    })
    let min = Math.floor(totalDurationSec / 60);
    let sec = totalDurationSec % 60;
    //Show some exercises from the workout (first three)
    var exampleExercises = ""
    for(var i = 0; i < this.props.workout.exercises.length; i++) {
      if(i >= 3) { break;}
      exampleExercises += this.props.workout.exercises[i].name;
      if(i < 2 && i < this.props.workout.exercises.length-1) {
        exampleExercises += ", "
      }
    }
    return (
      <WorkoutCard style={[styles.viewStyle, this.props.style]}>
        <Menu>
          <MenuTrigger
            triggerOnLongPress={true}
            customStyles={triggerMenuTouchable}
          >
            <Text style={[textStyle, FontStyles.h1]}>{this.props.workout.name}</Text>
            <View style={styles.info}>
              <Text style={textStyle}>Category: <Text style={FontStyles.bold}>{this.props.workout.category}</Text></Text>
              <Text style={textStyle}>Total exercises: <Text style={FontStyles.bold}>{this.props.workout.exercises.length}</Text></Text>
              <Text style={textStyle}>Exercises include:  <Text style={FontStyles.bold}>{exampleExercises}</Text></Text>
              <Text style={textStyle}>Duration: <Text style={FontStyles.bold}>{min}m:{sec}s</Text></Text>
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={popUpStyles}>
            <MenuOption text="Add to my library" />
            <MenuOption text="Share" />
          </MenuOptions>
        </Menu>
      </WorkoutCard>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    padding: 10
  },
  info: {
    paddingTop: 5
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
