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
import firebase from "react-native-firebase";
import moment from "moment";

class EditWorkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      darkTheme: false,
      name: "",
      category: "",
      exercises: [
        {
          id: 0,
          name: "",
          description: "",
          exerciseSets: []
        }
      ],
      saved: false,
      workoutCategories: [],
      predefinedExercises: []
    };

    // const { params } = this.props.navigation.state;
    // this.workouts = params.workouts;

    this.addExercise = this.addExercise.bind(this);
    this.changeExerciseName = this.changeExerciseName.bind(this);
    this.changeExerciseDesc = this.changeExerciseDesc.bind(this);
    this.changeExerciseSets = this.changeExerciseSets.bind(this);
    this.deleteExercise = this.deleteExercise.bind(this);
    this.saveWorkout = this.saveWorkout.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  componentDidMount() {
    this.setState({
        name: this.props.workout.name,
        category: this.props.workout.category,
        exercises: this.props.workout.exercises,
    });

    firebase
      .database()
      .ref("/common/workoutCategories/")
      .once("value")
      .then(snapshot => {
        let workoutCategories = [];
        snapshot.forEach(function(category) {
          workoutCategories.push(category.val());
        });
        this.setState({ workoutCategories });
      });

    firebase
      .database()
      .ref("/common/exercises/")
      .on("value", snapshot => {
        let predefinedExercises = [];
        snapshot.forEach(function(exercise) {
          predefinedExercises.push(exercise.val());
        });
        this.setState({ predefinedExercises });
      });
  }

  goHome() {
    Alert.alert(
      "Workout not saved",
      "Are you sure you want go back to home screen?",
      [
        {
          text: "Yes"
          // onPress: () => this.props.navigation.navigate("UserLibrary")
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  addExercise() {
    let exercise = {
      id: this.state.exercises.length,
      name: "",
      description: "",
      exerciseSets: [
        {
          id: 0,
          duration: 0,
          repetitions: 0,
          weight: 0,
          notes: "",
          break: 0
        }
      ]
    };

    let exercises = this.state.exercises;
    exercises.push(exercise);
    this.setState({ exercises, saved: false });
  }

  changeExerciseName(name, i) {
    let exercises = this.state.exercises;
    let exercise = exercises[i];
    exercise.name = name;
    this.setState({ exercises, saved: false });
  }

  changeExerciseDesc(desc, i) {
    let exercises = this.state.exercises;
    let exercise = exercises[i];
    exercise.description = desc;
    this.setState({ exercises, saved: false });
  }

  changeExerciseSets(sets, i) {
    let exercises = this.state.exercises;
    let exercise = exercises[i];
    exercise.exerciseSets = sets;
    this.setState({ exercises, saved: false });
  }

  deleteExercise(i) {
    let exercises = this.state.exercises;
    if (exercises.length > 1) {
      exercises = exercises.filter(exercise => exercise.id !== i);
      exercises.forEach((exercise, id) => {
        exercise.id = id;
      });
      this.setState({ exercises });
    }
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
      this.setState({ saved: true });
      const user = firebase.auth().currentUser;
      if (user) {
        const timestamp = Number(moment().format("x"));

        const userDataRef = firebase
          .database()
          .ref("users/" + user.uid + "/workouts/");
        //push() method without arguments is a pure client-side operation.
        //generate a new ref where the object will be saved
        var newWorkoutRef = userDataRef.push();
        newWorkoutRef
          .set({
            //use refKey as a unique id
            id: newWorkoutRef.key,
            name: this.state.name,
            category: this.state.category,
            createdBy: user.email,
            timeCreated: timestamp,
            exercises: this.state.exercises
          })
          .then(data => {
            this.goHome();
            console.warn(JSON.stringify(this.state));
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        Alert.alert("Couldn't save workout 😔 Try again later.", message);
      }
    }
  }

  render() {
    const theme = getStyleSheet(this.state.darkTheme);

    return (
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
                {this.state.name}
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
                  {this.state.workoutCategories.map((category, i) => {
                    return (
                      <Picker.Item key={i} label={category} value={category} />
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
                      predefinedExercises={this.state.predefinedExercises}
                      style={styles.exersiceDetails}
                      onNameChange={this.changeExerciseName}
                      onDescChange={this.changeExerciseDesc}
                      onSetsChange={this.changeExerciseSets}
                      onDeletePress={() => this.deleteExercise(idx)}
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

export default EditWorkout;
