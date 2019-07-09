import React, { Component } from "react";
import WorkoutCard from "../components/WorkoutCard";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Icon } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { FontStyles } from '../styles/global';

class DiscoverItem extends Component {
  constructor(props){
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
    for(var i = 0; i < workout.exercises.length; i++) {
      if(i >= 3) { break;}
      exampleExercises += workout.exercises[i].name;
      if(i < 2 && i < workout.exercises.length-1) {
        exampleExercises += ", "
      }
    }
    return (
      <WorkoutCard style={[styles.viewStyle, this.props.style]}>
        <Menu>
          <MenuTrigger
            triggerOnLongPress={true}
            customStyles={triggerMenuTouchable} 
            onAlternativeAction={this.onPress} //because triggerOnLongPress triggers onPress, regular press triggers onAlternativeAction
          >
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
            <View style={{ alignItems: 'flex-end' }}>
                        <Button
                            type="clear"
                            icon={<Icon name="play-arrow" size={22} color={textStyle.color} />}
                            onPress={this._onPlayButtonClick}
                        />
                    </View>
          </MenuTrigger>
          <MenuOptions customStyles={popUpStyles}>
            <MenuOption text="Details" onSelect={() => this.onPress()}/>
            <MenuOption text="Play" onSelect={() => this. _onPlayButtonClick()}/>
            <MenuOption text="Add to my library" onSelect={() => alert(`Add to my library will be added soon`)}/>
            <MenuOption text="Share" onSelect={() => alert(`Share will be added soon`)}/>
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

const popUpStyles = {
  optionsContainer: {
    borderRadius: 6,
    width: 130
  }
};

const triggerMenuTouchable = { TriggerTouchableComponent: TouchableOpacity };

export default DiscoverItem;
