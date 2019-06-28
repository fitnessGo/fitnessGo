import React from 'react';
import { ScrollView, View, StyleSheet, Text, TextInput, Picker, SafeAreaView } from 'react-native';
import { Button } from 'react-native-elements';
import getStyleSheet from "../styles/themestyles";
import { FontStyles, ScreenStyles } from '../styles/global';
import ExerciseDetailsView from './ExerciseDetailsView';

class WorkoutDetailsScreen extends React.Component {
    constructor(props) {
        super(props)

        const { params } = this.props.navigation.state;
        this.workout = params.workout 
        //TODO: this should show all the categories available in the database
        this.workoutCategories = [
            'Stretching', 'Cardio'
        ]
        this.state = {
            darkTheme: window.darkTheme,
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
                <Button
                    type="clear"
                    title="save"
                    style={{ flexDirection: 'row',  alignSelf: 'flex-end'}}
                    onPress={() => {
                        //Calback to home view
                        this.props.navigation.state.params.finishedEditing(this.workout);
                    }}/>
                    <View style={styles.container}>
                        <View style={styles.workoutInfo}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                editable={this.state.editable}
                                onChangeText={(text) => this.workout.name = text}
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
                                this.workout.exercises.map((exercise, i) => {
                                    return (
                                        <ExerciseDetailsView key={i} darkTheme={this.state.darkTheme} exercise={exercise} style={styles.exersiceDetails} />
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