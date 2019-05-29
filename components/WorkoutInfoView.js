//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { FontStyles, ScreenStyles } from '../styles/global';

/*
This component renders information about workout

Parameters:
 workout - Workout object
*/
class WorkoutInfoView extends Component {
    constructor(props) {
        super(props);
        //This binding is necessary to make `this` work in the callback
        this._onPlayButtonClick = this._onPlayButtonClick.bind(this);
    }
    _onPlayButtonClick() {
        let description = "Play workout #" + this.props.workout.id;
        alert(description);
    }
    render() {
        if(this.props.workout === undefined){
            return null
        }
        //Dynamic style props
        const textStyle = 
        {
            color: this.props.style.color
        }
        
        //Components
        let exercisesDescription, exercisesDuration;
        //Computed variables
        let totalDurationSec = 0, totalExercises = 0;

        totalExercises = this.props.workout.exercises.length;
        //get total duration
        this.props.workout.exercises.map(exercise => {
            exercise.exerciseSets.map(set => {
                totalDurationSec+=set.duration
                totalDurationSec+=isNaN(set.break) ? 0 : set.break
            })
        })
        
        //Convert to human friendly time
        let min = Math.floor(totalDurationSec/60);
        let sec = totalDurationSec%60;

        //create discription texts
        workoutName=<Text style={[workoutViewStyleSheet.workoutName, textStyle]}>{this.props.workout.name}</Text>
        exercisesDuration = 
        <Text style={textStyle}>
            Total duration: <Text style={FontStyles.bold}>{min}m:{sec}s</Text>
        </Text>
        exercisesDescription = <Text style={textStyle}>Total exercises: <Text style={FontStyles.bold}>{totalExercises}</Text></Text>
        
        return (
            <View style={this.props.style}>
                {workoutName}
                {exercisesDescription}
                {exercisesDuration}
                <Button
                    type="clear"
                    icon={<Icon name="play-arrow" size={22} color={textStyle.color}/>}
                    style={{ flexDirection: 'row',  alignSelf: 'flex-end'}}
                    onPress={this._onPlayButtonClick}
                />
            </View>
        );
    }
}
const workoutViewStyleSheet = StyleSheet.create({
    workoutName: {
        fontSize: 18
    }
});

export default WorkoutInfoView;