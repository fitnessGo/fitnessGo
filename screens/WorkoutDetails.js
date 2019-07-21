import React from "react";
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
import ExerciseDetailsView from "./ExerciseDetailsView";
import { NavigationActions } from "react-navigation";
import { showMessage } from "react-native-flash-message";
import DatabaseManager from "../components/DatabaseManager";
import EditWorkout from "./EditWorkout";


class WorkoutDetailsScreen extends React.Component {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    this.workout = params.workout;
    this.discoverWorkout = params.discoverWorkout;
    //TODO: this should show all the categories available in the database
    this.workoutCategories = ["Stretching", "Cardio"];
    this.state = {
      darkTheme: window.darkTheme,
      editing: false,
      workoutcategory: this.workout.category
    };

    this.editWorkout = React.createRef();
    this.closeButtonPressed = this.closeButtonPressed.bind(this);
    this.editButtonPressed = this.editButtonPressed.bind(this);
    this.addButtonPressed = this.addButtonPressed.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      closeButtonPressed: this.closeButtonPressed,
      editButtonPressed: this.editButtonPressed,
      addButtonPressed: this.addButtonPressed
    });
    const backAction = NavigationActions.back({
      key: "Profile"
    });
    this.props.navigation.dispatch(backAction);
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    if (params.discoverWorkout) {
      return {
        headerLeft: (
          <Button
            type="clear"
            onPress={params.closeButtonPressed}
            title="Close"
          />
        ),
        headerRight: (
          <Button type="clear" onPress={params.addButtonPressed} title="Add" />
        )
      };
    }
    //Show edit if the workout is in user library
    else {
      let buttonName = navigation.getParam("editing") ? "Save" : "Edit";
      return {
        headerLeft: (
          <Button
            type="clear"
            onPress={params.closeButtonPressed}
            title="Close"
          />
        ),
        headerRight: (
          <Button
            type="clear"
            onPress={params.editButtonPressed}
            title={buttonName}
          />
        )
      };
    }
  };

  closeButtonPressed() {
    if (this.state.editing) {
      Alert.alert(
        "Workout not saved",
        "All unsaved changes will be lost",
        [
          {
            text: "Ok",
            onPress: () => this.props.navigation.pop()
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
    } else {
      this.props.navigation.pop();
    }
  }
  editButtonPressed() {
    if (this.state.editing) {
      this.editWorkout.current.saveWorkout(this.workout);
      this.props.navigation.state.params.finishedEditing(this.workout);

      showMessage({
        message: "Changes saved",
        icon: "auto",
        type: "success"
      });
    }
    this.setState({ editing: !this.state.editing });
    this.props.navigation.setParams({ editing: !this.state.editing });
  }
  addButtonPressed() {
    if (!this.workout.added) {
      var workout = { ...this.workout, refId: this.workout.id };
      DatabaseManager.AddWorkoutToUserLibrary(workout)
        .then(() => {
          showMessage({
            message: "Workout was added to your library",
            icon: "auto",
            type: "success"
          });
          this.workout.added = true;
        })
        .catch(error => {
          showMessage({
            message: "Could not add workout to your library",
            description: error,
            icon: "auto",
            type: "danger"
          });
        });
    } else {
      showMessage({
        message: "This workout is already in your library",
        icon: "auto",
        type: "info"
      });
    }
  }
  render() {
    const theme = getStyleSheet(this.state.darkTheme);
    if (this.workout.exercises === undefined) {
      return null;
    }
    return (
      <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
        {this.state.editing && <EditWorkout workout={this.workout} ref={this.editWorkout} />}
        {!this.state.editing && (
          <ScrollView style={[ScreenStyles.screenContainer, { height: 20 }]}>
            <View style={styles.container}>
              <View style={styles.workoutInfo}>
                <Text style={[FontStyles.h1, FontStyles.bold]}>{this.workout.name}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text style={theme.text}>Category:</Text>
                  <Text style={theme.text}>{this.workout.category}</Text>
                </View>
              </View>
              <View style={styles.exercises}>
                {this.workout.exercises.map((exercise, i) => {
                  return (
                    <ExerciseDetailsView
                      key={i}
                      darkTheme={this.state.darkTheme}
                      exercise={exercise}
                      style={styles.exersiceDetails}
                    />
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}
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
export default WorkoutDetailsScreen;
