import React, { Component } from "react";
import {
  Alert,
  Button,
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  Picker,
  SafeAreaView,
  Platform
} from "react-native";
import { Icon } from "react-native-elements";
import getStyleSheet from "../styles/themestyles";
import { FontStyles, ScreenStyles } from "../styles/global";
import { thisExpression } from "@babel/types";
import ExerciseCard from "../components/ExerciseCard";
import { KeyboardAvoidingView } from "react-native";

class CreateWorkoutScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: <Button onPress={params.save} title="Save" />,
      headerLeft: <Button onPress={params.goHome} title="< Home" />,
    };
  };

  constructor(props) {
    super(props);
    this.workoutCategories = ["Stretching", "Cardio"];
    this.state = {
      darkTheme: false,
      name: "",
      category: this.workoutCategories[0],
      exercises: [
        {
          id: 0,
          name: "",
          description: "",
          exerciseSets: []
        }
      ],
      saved: false
    };

    const { params } = this.props.navigation.state;
    this.workouts = params.workouts;

    this.addExercise = this.addExercise.bind(this);
    this.changeExerciseName = this.changeExerciseName.bind(this);
    this.changeExerciseDesc = this.changeExerciseDesc.bind(this);
    this.changeExerciseSets = this.changeExerciseSets.bind(this);
    this.saveWorkout = this.saveWorkout.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ save: this.saveWorkout });
    this.props.navigation.setParams({ goHome: this.goHome });
  }

  goHome(){
    if(this.state.saved){
      this.props.navigation.navigate('UserLibrary');
    } else {
      Alert.alert(
        "Workout not saved",
        'Are you sure you want go back to home screen?',
        [
          {text: 'Yes', onPress: () => this.props.navigation.navigate('UserLibrary')},
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  }

  addExercise() {
    let exercise = {
      id: this.state.exercises.length,
      name: "",
      description: "",
      exerciseSets: [
        {
          id: 0,
          duration: 180,
          repetitions: 0,
          weight: 0,
          notes: "",
          break: 0
        }
      ]
    };

    let exercises = this.state.exercises;
    exercises.push(exercise);
    this.setState({ exercises });
    this.setState({ saved: false });
  }

  changeExerciseName(name, i) {
    let exercises = this.state.exercises;
    let exercise = exercises[i];
    exercise.name = name;
    this.setState({ exercises });
    this.setState({ saved: false });
  }

  changeExerciseDesc(desc, i) {
    let exercises = this.state.exercises;
    let exercise = exercises[i];
    exercise.description = desc;
    this.setState({ exercises });
    this.setState({ saved: false });
  }

  changeExerciseSets(sets, i) {
    let exercises = this.state.exercises;
    let exercise = exercises[i];
    exercise.exerciseSets = sets;
    this.setState({ exercises });
    this.setState({ saved: false });
  }

  validateWorkout() {
    let exercises = this.state.exercises;
    let exerciseNameMissing = false;
    let message = "";
    for (let i = 0; i < exercises.length; i++) {
      if (exercises[i].name === "") {
        exerciseNameMissing = true;
      }
    }

    if (this.state.name === "") {
      message = "Workout name is missing";
    } else if (this.state.exercises.length === 0) {
      message = "Add some exercises to the workout";
    } else if (exerciseNameMissing) {
      message = "Ensure that all exercises have names.";
    }

    return message;
  }

  saveWorkout() {
    let message = this.validateWorkout();
    if (message === "") {
      let newWorkout = {
        id: 9999,
        name: this.state.name,
        category: this.state.category,
        description: "",
        createdBy: "name2@example.com",
        timeCreated: 24042019,
        exercises: this.state.exercises
      };
      this.setState({ saved: true });
      this.workouts.push(newWorkout);
      this.props.navigation.state.params.update(this.workouts);
    } else {
      Alert.alert("Error!", message);
    }
  }

  render() {
    const theme = getStyleSheet(this.state.darkTheme);

    return (
      <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
          behavior="padding"
          enabled
          keyboardVerticalOffset={100}
        >
          <ScrollView style={ScreenStyles.screenContainer}>
            <View style={styles.container}>
              <View style={styles.workoutInfo}>
                <TextInput
                  underlineColorAndroid="transparent"
                  onChangeText={name => this.setState({ name })}
                  placeholder="Workout Name"
                  style={[theme.text, FontStyles.h1, FontStyles.bold]}
                >
                  {this.name}
                </TextInput>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text style={theme.text}>Category:</Text>
                  <Picker
                    enabled={this.state.editable}
                    selectedValue={this.state.category}
                    style={{
                      height: 30,
                      minWidth: "30%",
                      alignSelf: "flex-start"
                    }}
                    itemStyle={{
                      height: 34,
                      ...FontStyles.default,
                      ...theme.text
                    }}
                    onValueChange={(category, catIdx) =>
                      this.setState({ category })
                    }
                  >
                    {this.workoutCategories.map((category, i) => {
                      return (
                        <Picker.Item
                          key={i}
                          label={category}
                          value={category}
                        />
                      );
                    })}
                  </Picker>
                </View>
                <View style={styles.exercises}>
                  {this.state.exercises.map((exercise, idx) => {
                    return (
                      <ExerciseCard
                        darkTheme={this.state.darkTheme}
                        key={idx}
                        id={idx}
                        exercise={exercise}
                        style={styles.exersiceDetails}
                        onNameChange={this.changeExerciseName}
                        onDescChange={this.changeExerciseDesc}
                        onSetsChange={this.changeExerciseSets}
                      />
                    );
                  })}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end"
                  }}
                >
                  <Button
                    title="Add Exercise"
                    style={{
                      marginBottom: 15
                    }}
                    onPress={this.addExercise}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    left: "5%"
  },
  exercises: {
    marginTop: 10
  },
  exersiceDetails: {
    marginBottom: 10
  }
});

export default CreateWorkoutScreen;
