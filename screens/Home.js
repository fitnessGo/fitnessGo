import React, { Component } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity, Dimensions, Image
} from "react-native";
import { Button, Icon } from "react-native-elements";
import WorkoutCard from "../components/WorkoutCard";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider
} from "react-native-popup-menu";
import getStyleSheet from "../styles/themestyles";
import { ScreenStyles, FontStyles } from "../styles/global";
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
      refreshing: false,
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
    this.localData = null; // or this
  }

  componentDidMount() {
    this.fetchUserWorkouts(workouts => {
      this.setState({ workouts: workouts });
    });
  }

  fetchUserWorkouts(onCompletion) {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase
        .database()
        .ref("users/" + user.uid + "/workouts")
        .on("value", snapshot => {
          let workouts = [];
          snapshot.forEach(snap => {
            let workout = { id: snap.key, ...snap.val() };
            workouts.push(workout);
          });
          onCompletion(workouts);
        });
    } else {
      Alert.alert("Couldn't fetch your workouts 😔 Try again later.");
      onCompletion(null);
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
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchUserWorkouts(workouts => {
      this.setState({ refreshing: false, workouts: workouts });
    });
  };

  deleteWorkout(workout) {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this workout?",
      [
        {
          text: "Delete",
          onPress: () => {
            const user = firebase.auth().currentUser;
            firebase
              .database()
              .ref("users/" + user.uid + "/workouts")
              .child(workout.id)
              .remove();
          },
          style: "destructive"
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  }

  render() {
    const theme = getStyleSheet(this.state.darkTheme);
    const workoutViewStyle = this.state.darkTheme
      ? styles.workoutViewDark
      : styles.workoutViewLight;
    if (!this.state.workouts || this.state.workouts.length == 0) {
      return (
        <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
          <ScrollView
            style={[ScreenStyles.screenContainer, styles.workoutViewContainer]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View style={{ flex: 1, alignItems: "center", marginTop: "2%" }}>
              <Text style={[theme.text, { textAlign: 'center', fontSize: 16 }]}>
                Click + to create a new workout or find more in the Discover Tab
              </Text>
              <Button
                type="clear"
                icon={<Icon name="add-circle" size={44} color={theme.text.color} />}
                style={{ alignSelf: "flex-end" }}
                onPress={this._onCreateNewButtonClick}
              />
            </View>
          </ScrollView>
          <View style={styles.scaleImageContainer}>
            <Image resizeMode={'contain'} source={require('../assets/images/main/ScalesBottleMat.png')} 
               style={styles.containerImage}/>
          </View>
          <View style={styles.stopwatchImageContainer}>
            <Image resizeMode={'contain'} source={require('../assets/images/main/Stopwatch.png')}
              style={[styles.containerImage]} />
          </View>
          <View style={styles.weigthImageContainer}>
            <Image resizeMode={'contain'} source={require('../assets/images/main/Weights.png')} style={styles.containerImage}/>
          </View>
        </SafeAreaView>
      );
    }
    return (
      // var workoutViews = new Array();
      <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
        <ScrollView
          style={ScreenStyles.screenContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View ref="workoutsView" style={styles.workoutViewContainer}>
            {this.state.workouts.map((w, index) => {
              return (
                <Menu key={index}>
                  <MenuTrigger
                    triggerOnLongPress={true}
                    customStyles={triggerMenuTouchable}
                    onAlternativeAction={view =>
                      this._onWorkoutSelect(w, view)
                    }
                  >
                    <WorkoutCard
                      style={workoutViewStyle}
                      workout={w}
                      onPress={(workout, view) =>
                        this._onWorkoutSelect(workout, view)
                      }
                      onPlayButtonClick={workout =>
                        this._onPlayButtonClick(workout)
                      }
                    />
                  </MenuTrigger>
                  <MenuOptions customStyles={popUpStyles}>
                    <MenuOption
                      text="Details"
                      onSelect={view => this._onWorkoutSelect(w, view)}
                    />
                    <MenuOption
                      text="Delete"
                      onSelect={() => this.deleteWorkout(w)}
                    />
                  </MenuOptions>
                </Menu>
              );
            })}
          </View>
        </ScrollView>
        <View style={{ alignItems: "flex-end" }}>
          <Button
            type="clear"
            icon={
              <Icon name="add-circle" size={44} color={theme.text.color} />
            }
            onPress={workout =>
              this._onCreateNewButtonClick(this.state.workouts)
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}
const win = Dimensions.get('window');
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
  },
  containerImage: {
    flex: 1,
    width: undefined,
    height: undefined,
    alignSelf: 'stretch'
  },
  scaleImageContainer: { 
    position: 'absolute', 
    bottom: "20%", 
    left: "-10%", 
    width: "55%", 
    aspectRatio: 1, 
    justifyContent: 'center', 
    padding: 0,
    transform: [{ rotateY: '180deg' }]
  },
  stopwatchImageContainer: { 
    position: 'absolute', 
    bottom: "45%", 
    right: "-5%", 
    width: "32%", 
    aspectRatio: 1, 
    justifyContent: 'center', 
    transform: [{ rotate: '-25deg' }]
  },
  weigthImageContainer: { 
    position: 'absolute', 
    bottom: "-6%", 
    right: "-12%", 
    width: "50%", 
    aspectRatio: 1, 
    justifyContent: 'center', 
    padding: 15 ,
    transform: [{ rotate: '-20deg' }]
  },
});

const popUpStyles = {
  optionsContainer: {
    borderRadius: 6,
    width: 130
  }
};

const triggerMenuTouchable = { TriggerTouchableComponent: TouchableOpacity };

export default HomeScreen;
