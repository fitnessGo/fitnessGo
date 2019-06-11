import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text, Image, TouchableOpacity, TouchableHighlight, SafeAreaView } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import WorkoutView from "../components/WorkoutInfoView";
import getStyleSheet from "../styles/themestyles";
import { ScreenStyles } from '../styles/global';

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) =>{
        return {
            headerLeft: (
                <Button
                type="clear"
                icon={<Icon name="settings" size={22}/>}
                style={{ flexDirection: 'row',  alignSelf: 'flex-end'}}
                onPress={ () => navigation.navigate('Settings') }
            />
            ),
        }
};
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
                description: '',
                category: 'Stretching',
                createdBy: "name1@example.com",
                timeCreated: 23042019,
                exercises: [
                    {
                        id: 3,
                        name: "Push-ups",
                        description: "A physical exercise performed by lying with your face down and using only your arms to raise and lower your body.",
                        exerciseSets: [{
                            id: 123,
                            duration: 91,
                            repetitions: 20,
                            weight: 0,
                            notes: "",
                            break: 20
                        },
                        {
                            id: 3232,
                            duration: 63,
                            repetitions: 22,
                            weight: 5,
                            notes: ""
                        }]
                    },
                    {
                        id: 3,
                        name: "Bicycle crunch",
                        description: "Exercise 2 description",
                        exerciseSets: [{
                            id: 123,
                            duration: 91,
                            repetitions: 20,
                            weight: 0,
                            notes: "",
                            break: 20
                        },
                        {
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
                description: '',
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
        this._onWorkoutSelect = this._onWorkoutSelect.bind(this);
    }
    _onCreateNewButtonClick(prop) {
        alert("Create new workout will be added soon");
    }
    _onWorkoutUpdate() {
        this.selectedWorkout.forceUpdate();
    }
    _onWorkoutSelect(w, view) {
        this.selectedWorkout = view;
        this.props.navigation.push('WorkoutDetails', { workout: w, finishedEditing: this._onWorkoutUpdate.bind(this) });
    }
    _onPlayButtonClick(w) {
        this.props.navigation.push('RunWorkout', { workout: w });
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
                            this.workouts.map((w, index) => {
                                return (
                                    <WorkoutView key={index} style={workoutViewStyle} workout={w} onPress={(workout, view) => this._onWorkoutSelect(workout, view)} onPlayButtonClick={(workout) => this._onPlayButtonClick(workout)}></WorkoutView>
                                );
                            })
                        }
                    </View>
                </ScrollView>
                <View style={{ alignItems: 'flex-end' }}>
                <Button
                    type="clear"
                    icon={<Icon name="add-circle" size={44} color={theme.text.color} />}
                    onPress={this._onCreateNewButtonClick}
                />
                </View>
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
