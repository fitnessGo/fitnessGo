import React, { Component } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView
} from "react-native";
import { Button, Icon } from "react-native-elements";
import WorkoutView from "../components/WorkoutInfoView";
import getStyleSheet from "../styles/themestyles";
import { ScreenStyles } from "../styles/global";
import firebase from "react-native-firebase";

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <Button
          type="clear"
          icon={<Icon name="settings" size={22} />}
          style={{ flexDirection: "row", alignSelf: "flex-end" }}
          onPress={() => navigation.navigate("Settings")}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      darkTheme: window.darkTheme,
      dataReady: true,
      workouts: []
    };
    this._onWorkoutSelect = this._onWorkoutSelect.bind(this);
    this._onCreateNewButtonClick = this._onCreateNewButtonClick.bind(this);
    this.updateWorkouts = this.updateWorkouts.bind(this);

    //when returned to this screen check if props have changed
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        if (this.state.darkTheme != window.darkTheme) {
          this.setState({ darkTheme: window.darkTheme });
        }
      }
    );
    this.localData=null; // or this
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    if (user) {
      const userDataRef = firebase
        .database()
        .ref("users/" + user.uid + "/workouts").on('value', (snapshot) => {
            let workouts = [];
            snapshot.forEach(snap => {
                workouts.push(snap.val());
            });
            this.setState({ workouts });
        });
    } else {
      Alert.alert("Couldn't fetch your workouts 😔 Try again later.", message);
    }
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
  _onCreateNewButtonClick(w) {
    this.props.navigation.push("CreateWorkout", {
      workouts: this.state.workouts,
      update: this.updateWorkouts
    });
  }
  _onWorkoutUpdate() {
    this.selectedWorkout.forceUpdate();
  }
  _onWorkoutSelect(w, view) {
    this.selectedWorkout = view;
    this.props.navigation.navigate("WorkoutDetails", {
      workout: w,
      finishedEditing: this._onWorkoutUpdate.bind(this)
    });
  }
  _onPlayButtonClick(w) {
    this.props.navigation.navigate("RunWorkout", { workout: w });
  }
  updateWorkouts(workouts) {
    this.setState({ workouts });
  }
  render() {
    const theme = getStyleSheet(this.state.darkTheme);
    const workoutViewStyle = this.state.darkTheme
      ? styles.workoutViewDark
      : styles.workoutViewLight;
    if (!this.state.workouts) {
      return (
        <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
          <ScrollView
            style={[ScreenStyles.screenContainer, styles.workoutViewContainer]}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={theme.text}>
                No workouts found, create a new one
              </Text>
              <Button
                type="clear"
                icon={<Icon name="add" size={44} color={theme.text.color} />}
                style={{ alignSelf: "flex-end" }}
                onPress={this._onCreateNewButtonClick}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
    return (
      // var workoutViews = new Array();
      <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
        <ScrollView style={ScreenStyles.screenContainer}>
          <View ref="workoutsView" style={styles.workoutViewContainer}>
            {this.state.workouts.map((w, index) => {
              return (
                <WorkoutView
                  key={index}
                  style={workoutViewStyle}
                  workout={w}
                  onPress={(workout, view) =>
                    this._onWorkoutSelect(workout, view)
                  }
                  onPlayButtonClick={workout =>
                    this._onPlayButtonClick(workout)
                  }
                />
              );
            })}
          </View>
        </ScrollView>
        <View style={{ alignItems: "flex-end" }}>
          <Button
            type="clear"
            icon={<Icon name="add-circle" size={44} color={theme.text.color} />}
            onPress={workout =>
              this._onCreateNewButtonClick(this.state.workouts)
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  workoutViewContainer: {
    width: "90%",
    left: "5%"
  },
  workoutViewLight: {
    backgroundColor: "#1960d3",
    color: "#ffffff",
    fontSize: 24,
    padding: 10,
    marginBottom: 10
  },
  workoutViewDark: {
    backgroundColor: "#ffdd00",
    color: "#222222",
    fontSize: 24,
    padding: 10,
    marginBottom: 10
  }
});

export default HomeScreen;
