import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import WorkoutView from "../components/WorkoutInfoView";
import getStyleSheet from "../styles/themestyles";
import { ScreenStyles } from '../styles/global';

class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            darkTheme: false,
            dataReady: true
        }
        this.workouts = [
            {
                id: 2,
                name: "My morning workout",
                category: 1,
                createdBy: "name1@example.com",
                timeCreated: 23042019,
                exercises: [
                    {
                        id: 3,
                        name: "Push-up",
                        description: "Exercise 1 description",
                        exerciseSets: [{
                            id: 123,
                            duration: 91,
                            repetitions: 20,
                            weight: 0,
                            notes: "",
                            break: 20
                        }, {
                            id: 3232,
                            duration: 63,
                            repetitions: 22,
                            weight: 5,
                            notes: ""
                        }]
                    }
                ]
            },
            {
                id: 1123,
                name: "My morning workout with a super super long name",
                category: 2,
                createdBy: "name2@example.com",
                timeCreated: 24042019,
                exercises: [
                    {
                        id: 3,
                        description: "Exercise 1 description",
                        exerciseSets: [{
                            id: 123,
                            duration: 931,
                            repetitions: 20,
                            weight: 0,
                            notes: ""
                        }, {
                            id: 3232,
                            duration: 63,
                            repetitions: 22,
                            weight: 5,
                            notes: ""
                        }]
                    },
                    {
                        id: 3,
                        description: "Exercise 1 description",
                        exerciseSets: [{
                            id: 123,
                            duration: 91,
                            repetitions: 20,
                            weight: 0,
                            notes: ""
                        }, {
                            id: 3232,
                            duration: 63,
                            repetitions: 22,
                            weight: 5,
                            notes: ""
                        }]
                    }
                ]
            }
        ]
    }
    _onCreateNewButtonClick(prop) {
        alert("Create new workout will be added soon");
    }
    _onWorkoutUpdate() {
        this.selectedWorkout.forceUpdate();
        alert(this.workouts[0].name)
    }
    _onWorkoutSelect(w, view) {
        this.selectedWorkout = view;
        this.props.navigation.push('WorkoutDetails', { workout: w, finishedEditing: this._onWorkoutUpdate.bind(this) });
    }
    render() {
        const theme = getStyleSheet(this.state.darkTheme);
        const workoutViewStyle = this.state.darkTheme ? styles.workoutViewDark : styles.workoutViewLight
        if (this.workouts === undefined) {
            return (
                <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
                    <ScrollView style={[ScreenStyles.screenContainer, styles.workoutViewContainer]}>
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Text style={theme.text}>No workouts found, create a new one</Text>
                            <Button
                                type="clear"
                                icon={<Icon name="add" size={44} color={theme.text.color} />}
                                style={{ alignSelf: 'flex-end' }}
                                onPress={this._onCreateNewButtonClick}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )
        }
        return (
            // var workoutViews = new Array();
            <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
                <ScrollView style={ScreenStyles.screenContainer}>
                    <View style={styles.workoutViewContainer}>
                        {
                            this.workouts.map((w) => {
                                return (
                                    <WorkoutView style={workoutViewStyle} workout={w} onPress={(workout, view) => this._onWorkoutSelect(workout, view)}></WorkoutView>
                                );
                            })
                        }
                    </View>
                </ScrollView>
                <Button
                    type="clear"
                    icon={<Icon name="add-circle" size={44} color={theme.text.color} />}
                    style={{ alignSelf: 'flex-end' }}
                    onPress={this._onCreateNewButtonClick}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    workoutViewContainer: {
        width: '90%',
        left: "5%"
    },
    workoutViewLight: {
        backgroundColor: '#1960d3',
        color: '#ffffff',
        fontSize: 24,
        padding: 10,
        marginBottom: 10
    },
    workoutViewDark: {
        backgroundColor: '#ffdd00',
        color: '#222222',
        fontSize: 24,
        padding: 10,
        marginBottom: 10
    }
});

export default HomeScreen;
