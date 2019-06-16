import React, { Component } from "react";
import {
  Alert,
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  Picker,
  SafeAreaView
} from "react-native";
import { Button, Icon } from "react-native-elements";
import getStyleSheet from "../styles/themestyles";
import { FontStyles, ScreenStyles } from "../styles/global";
import { thisExpression } from "@babel/types";
import ExerciseCard from "../components/ExerciseCard";

class CreateWorkoutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.workoutCategories = ["Stretching", "Cardio"];
    this.state = {
      darkTheme: false,
      name: "",
      category: this.workoutCategories[0],
      exercises: []
    };

    this.addExercise = this.addExercise.bind(this);
    this.changeExerciseName = this.changeExerciseName.bind(this);
    this.changeExerciseDesc = this.changeExerciseDesc.bind(this);
    this.saveWorkout = this.saveWorkout.bind(this);
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
    this.setState({ exercises });
  }

  changeExerciseName(name, i) {
    let exercises = this.state.exercises;
    let exercise = exercises[i];
    exercise.name = name;
    this.setState({ exercises });
  }

  changeExerciseDesc(desc, i) {
    let exercises = this.state.exercises;
    let exercise = exercises[i];
    exercise.description = desc;
    this.setState({ exercises });
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
      alert("It's going to be saved to Firebase.");
      this.props.navigation.push("UserLibrary");
    } else {
      Alert.alert("Error!", message);
    }
  }

  render() {
    const theme = getStyleSheet(this.state.darkTheme);

    return (
      <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
        <ScrollView style={ScreenStyles.screenContainer}>
          <Button
            type="clear"
            title="Save"
            style={{ flexDirection: "row", alignSelf: "flex-end" }}
            onPress={this.saveWorkout}
          />
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
                    return <Picker.Item key={i} label={category} value={category} />;
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
                    />
                  );
                })}
              </View>
              <Button
                type="clear"
                title="Add exercise"
                style={{ flexDirection: "row", alignSelf: "flex-end", marginBottom: 15 }}
                onPress={this.addExercise}
              />
            </View>
          </View>
        </ScrollView>
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
