import React from 'react';
import { Alert, ScrollView, View, StyleSheet, Text, TextInput, Picker, SafeAreaView } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import getStyleSheet from "../styles/themestyles";
import { FontStyles, ScreenStyles } from '../styles/global';
import ExerciseDetailsView from './ExerciseDetailsView';
import { NavigationActions } from 'react-navigation';
class WorkoutDetailsScreen extends React.Component {
    constructor(props) {
        super(props)

        const { params } = this.props.navigation.state;
        this.workout = params.workout 
        this.discoverWorkout = params.discoverWorkout 
        //TODO: this should show all the categories available in the database
        this.workoutCategories = [
            'Stretching', 'Cardio'
        ]
        this.state = {
            darkTheme: window.darkTheme,
            editing: false,
            workoutcategory: this.workout.category
        }
        this.closeButtonPressed = this.closeButtonPressed.bind(this);
        this.editButtonPressed = this.editButtonPressed.bind(this);
    }

    componentDidMount(){ 
        this.props.navigation.setParams({ closeButtonPressed: this.closeButtonPressed, editButtonPressed: this.editButtonPressed });
        const backAction = NavigationActions.back({
            key: 'Profile',
          });
        this.props.navigation.dispatch(backAction);
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        
        if(params.discoverWorkout) { 
            return {
                headerLeft: <Button type="clear" onPress={params.closeButtonPressed} title="Close" />
            }
        }
        //Show edit if the workout is in user library
        else {
            let buttonName = navigation.getParam('editing') ? "Save" : "Edit"
            return {
                headerLeft: <Button type="clear" onPress={params.closeButtonPressed} title="Close" />,
                headerRight: <Button type="clear" onPress={params.editButtonPressed} title={buttonName} />,
            }
        };
    };

    closeButtonPressed() {
        if(this.state.editing) {
            Alert.alert(
                "Workout not saved",
                "All unsaved changes will be lost",
                [
                  {
                    text: "Ok",
                    onPress: () => this.props.navigation.pop(),
                  },
                  {
                    text: "Cancel",
                    style: "cancel"
                  }
                ],
                { cancelable: false }
              );
        }
        else {this.props.navigation.pop()}
    }
    editButtonPressed() {
        this.props.navigation.state.params.finishedEditing(this.workout);
        this.setState({editing: !this.state.editing})
        this.props.navigation.setParams({editing: !this.state.editing})
    }
    render() {
        const theme = getStyleSheet(this.state.darkTheme);
        if(this.workout.exercises === undefined ) {
            return null
        }
        return (
            <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
                <ScrollView style={[ScreenStyles.screenContainer, {height: 20}]}>
                    <View style={styles.container}>
                        <View style={styles.workoutInfo}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                editable={this.state.editing}
                                onChangeText={(text) => this.workout.name = text}
                                style={[theme.text, FontStyles.h1, FontStyles.bold]}
                            >{this.workout.name}</TextInput>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'flex-start' }}>
                                <Text style={theme.text}>Category:</Text>
                                <Picker
                                    enabled={this.state.editing}
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
        left: "5%"
    },
    exercises: {
        marginTop: 10
    },
    exersiceDetails: {
        marginBottom: 10,
    },
});
export default WorkoutDetailsScreen;