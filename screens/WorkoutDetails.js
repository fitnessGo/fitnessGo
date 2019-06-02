import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text, TextInput, Picker, SafeAreaView } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import WorkoutCard from '../components/WorkoutCard';
import getStyleSheet from "../styles/themestyles";
import { FontStyles, ScreenStyles } from '../styles/global';
import { Divider } from 'react-native-elements';



class SetDetailsView extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const setViewStyle = this.props.darkTheme || false ? setViewStyles.exersiseSetViewDark : setViewStyles.exersiseSetViewLight
        const setViewTextStyle = this.props.darkTheme || false ? setViewStyles.exersiseSetViewTextDark : setViewStyles.exersiseSetViewTextLight
        return (
            <View>
                <WorkoutCard style={setViewStyle}>
                    <Text style={setViewTextStyle}>Repetitions <Text style={FontStyles.bold}>{this.props.set.repetitions}</Text></Text>
                    <Text style={setViewTextStyle}>Duration <Text style={FontStyles.bold}>{this.props.set.duration}</Text> sec</Text>
                    <Text style={setViewTextStyle}>Break {this.props.set.break || 0} sec</Text>
                </WorkoutCard>
            </View>
        )
    }
}
const setViewStyles = StyleSheet.create({
    exersiseSetViewLight: {
        width: "95%",
        backgroundColor: '#fefefe',
        alignSelf: 'center',
        padding: 6,
        color: '#ffffff',
        marginTop: 10,
        marginBottom: 10
    },
    exersiseSetViewDark: {
        width: "95%",
        backgroundColor: '#5f5f5f',
        alignSelf: 'center',
        padding: 6,
        marginTop: 10,
        marginBottom: 10
    },
    exersiseSetViewTextLight: {
        color: '#000000'
    },
    exersiseSetViewTextDark: {
        color: '#ffffff'
    }
});


class ExerciseDetailsView extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const exerciseViewStyle = this.props.darkTheme || false ? exerciseViewStyles.exersiseViewDark : exerciseViewStyles.exersiseViewLight
        const exerciseViewTextStyle = this.props.darkTheme || false ? exerciseViewStyles.exersiseViewTextDark : exerciseViewStyles.exersiseViewTextLight
        return (
            <View style={this.props.style}>
                <WorkoutCard style={exerciseViewStyle}>
                    <Text style={[exerciseViewTextStyle, { ...FontStyles.h1, ...FontStyles.bold }]}>{this.props.exercise.name}</Text>
                    <Text style={exerciseViewTextStyle}>{this.props.exercise.description}</Text>
                    <View style={{ marginTop: 10 }}>
                        {this.props.exercise.exerciseSets.map((es, index) => {
                            return (
                                <View>
                                    <Text style={exerciseViewTextStyle}>Set {index + 1}</Text>
                                    <SetDetailsView set={es} darkTheme={this.props.darkTheme} />
                                </View>
                            );
                        })
                        }
                    </View>
                </WorkoutCard>
            </View>
        )
    }
}

const exerciseViewStyles = StyleSheet.create({
    exersiseViewLight: {
        padding: 6,
        backgroundColor: '#ffffff',
    },
    exersiseViewDark: {
        padding: 6,
        backgroundColor: '#4f4f4f',
    },
    exersiseViewTextLight: {
        color: '#000000',
        fontSize: 16,
    },
    exersiseViewTextDark: {
        color: '#ffffff',
        fontSize: 16
    }
});

class WorkoutDetailsScreen extends React.Component {
    constructor(props) {
        super(props)

        const { params } = this.props.navigation.state;
        this.workout = params ? params.workout : {
            id: 2,
            name: "WORKOUT",
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
        }
        this.workoutCategories = [
            'Stretching', 'Cardio'
        ]
        this.state = {
            darkTheme: false,
            editable: true,
            workoutcategory: this.workout.category
        }
    }

    render() {
        const theme = getStyleSheet(this.state.darkTheme);
        if(this.workout.exercises === undefined ) {
            return null
        }
        return (
            <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
                <ScrollView style={ScreenStyles.screenContainer}>
                    <View style={styles.container}>
                        <View style={styles.workoutInfo}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                editable={this.state.editable}
                                style={[theme.text, FontStyles.h1, FontStyles.bold]}
                            >{this.workout.name}</TextInput>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'flex-start' }}>
                                <Text style={theme.text}>Category:</Text>
                                <Picker
                                    enabled={this.state.editable}
                                    selectedValue={this.state.workoutcategory}
                                    style={{ height: 30, minWidth: '30%', alignSelf: 'flex-start' }} itemStyle={{ height: 34, ...FontStyles.default, ...theme.text,}}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ workoutcategory: itemValue })
                                    }>
                                    {
                                        this.workoutCategories.map(category => {
                                            return (
                                                <Picker.Item label={category} value={category} />
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.exercises}>
                            {
                                this.workout.exercises.map((exercise, ei) => {
                                    return (
                                        <ExerciseDetailsView darkTheme={this.state.darkTheme} exercise={exercise} style={styles.exersiceDetails} />
                                    );
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        left: "5%",
    },
    exercises: {
        marginTop: 10
    },
    exersiceDetails: {
        marginBottom: 10,
    },
});
export default WorkoutDetailsScreen;