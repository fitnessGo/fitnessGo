import React, { Component } from "react";
import WorkoutCard from "../components/WorkoutCard";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Icon } from 'react-native-elements';
import { FontStyles } from '../styles/global';

class DiscoverItem extends Component {
  constructor(props) {
    super(props);
    this._onPlayButtonClick = this._onPlayButtonClick.bind(this);
  }
  onPress = () => {
    this.props.onPress(this.props.workout);
  }
  _onPlayButtonClick() {
    this.props.onPlayButtonClick(this.props.workout);
  }
  render() {
    let textStyle;
    if (this.props.style != undefined) {
      textStyle = { color: this.props.style.color }
    }
    //Calc workout total duration
    var totalDurationSec = 0;
    const workout = this.props.workout;
    workout.exercises.map(exercise => {
      exercise.exerciseSets.map(set => {
        totalDurationSec += set.duration
        totalDurationSec += isNaN(set.break) ? 0 : set.break
      })
    })
    let min = Math.floor(totalDurationSec / 60);
    let sec = totalDurationSec % 60;
    //Show some exercises from the workout (first three)
    var exampleExercises = ""
    for (var i = 0; i < workout.exercises.length; i++) {
      if (i >= 3) { break; }
      exampleExercises += workout.exercises[i].name;
      if (i < 2 && i < workout.exercises.length - 1) {
        exampleExercises += ", "
      }
    }
    const WorkoutAddedBadge = () => {
      if (workout.added) {
        return (
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', alignContent: 'flex-end' }}>
            <Text style={{ color: '#dadada' }}>Added to my library</Text>
            <Icon name='check-circle' type='MaterialIcons' color='#5fe800' size={22} />
          </View>
        )
      }
      return <View />;
    }

    return (
        <WorkoutCard style={[styles.viewStyle, this.props.style]}>
          <Text style={[textStyle, FontStyles.h1]}>{workout.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>By <Text style={FontStyles.bold}>{workout.createdBy}</Text></Text>
          </View>
          <View style={styles.info}>
            <Text style={textStyle}>Category: <Text style={FontStyles.bold}>{workout.category}</Text></Text>
            <Text style={textStyle}>Total exercises: <Text style={FontStyles.bold}>{workout.exercises.length}</Text></Text>
            <Text style={textStyle}>Exercises include:  <Text style={FontStyles.bold}>{exampleExercises}</Text></Text>
            <Text style={textStyle}>Duration: <Text style={FontStyles.bold}>{min}m:{sec}s</Text></Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', }}>
            <WorkoutAddedBadge />
            <Button
              type="clear"
              icon={<Icon name="play-arrow" size={22} color={textStyle.color} />}
              onPress={this._onPlayButtonClick}
            />
          </View>
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
  },
  badge: {
    backgroundColor: '#f80',
    paddingHorizontal: 5,
    paddingVertical: 0,
    borderRadius: 10,
    left: -3,
    alignSelf: 'flex-start'
  },
  badgeText: {
    color: '#ffffff',
    fontSize: FontStyles.default.fontSize
  }
});
export default DiscoverItem;
