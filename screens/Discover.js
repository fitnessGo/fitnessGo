import React, { Component } from "react";
import DiscoverItem from "../components/DiscoverItem";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { SafeAreaView, View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import getStyleSheet from "../styles/themestyles";
import { ScreenStyles } from '../styles/global';
import moment from 'moment';
import firebase from 'react-native-firebase';
import { showMessage } from "react-native-flash-message";

class Discover extends Component {
  constructor(props) {
    super(props)
    this.state = {
      darkTheme: window.darkTheme,
      refreshing: false
    }
    this.workouts = []

    //when returned to this screen check if props have changed 
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        if (this.state.darkTheme != window.darkTheme) {
          this.setState({ darkTheme: window.darkTheme });
        }
        // Do not fetch when the tab opens for the first time. 
        // Only do it if the user went back to this tab from another tab. 
        // In case if user deleted a Discover workout from their library, we need to remove a label from it on this tab
        if(this.state.dataReceived) {
          this.setState({refreshing: true})
          this.fetchWorkoutsFromDatabase(() => {
            this.setState({ refreshing: false })
          });
        }
      }
    );
  }
  componentDidMount() {
    this.fetchWorkoutsFromDatabase(() => {
      this.setState({ dataReceived: true })
    });
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
  getUserSavedDiscoverWorkouts(onCompletion) {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref("users/" + user.uid + "/workouts/").once('value').then((snapshot) => {
        var references = []
        snapshot.forEach(function (workoutRef) {
          const w = workoutRef.val();
          if (w.refId)
            references.push(w.refId)
        });
        onCompletion(references)
      });
    } else {
      onCompletion(null)
    }
  }

  fetchWorkoutsFromDatabase(onCompletion) {
    firebase.database().ref('/common/workouts/').once('value').then((snapshot) => {
      var wrks = []
      this.getUserSavedDiscoverWorkouts((references) => {
        snapshot.forEach(function (workoutRef) {
          var workout = workoutRef.val();
          //check if the discover workout was added to the user library
          if (references) {
            workout.added = references.includes(workout.id);
          }
          wrks.push(workout)
        });
        this.workouts = wrks
        onCompletion();
      });
    });
  }
  openWorkoutDetails(workout) {
    this.props.navigation.navigate('WorkoutDetails', { workout: workout, discoverWorkout: true });
  }
  playWorkout(workout) {
    this.props.navigation.navigate('RunWorkout', { workout: workout });
  }
  _addWorkoutToUserLib(workout) {
    if (!workout.added) {
      const user = firebase.auth().currentUser;
      if (user) {
        const timestamp = Number(moment().format('x'));
        const userDataRef = firebase.database().ref("users/" + user.uid + "/workouts/");
        var newWorkoutRef = userDataRef.push();
        //update props
        workout.timeCreated = timestamp;
        delete workout.added; //only needed it on this screen
        workout.refId = workout.id; //reference to Discover workout
        workout.id = newWorkoutRef.key; //update id (new Id in the user lib)
        newWorkoutRef.set(workout).then(data => {
          showMessage({
            message: "Workout was added to your library",
            icon: "auto",
            type: "success"
          })
          workout.added = true;
          this.setState({refreshing: false});
        }).catch(error => {
          showMessage({
            message: "Could not add workout to your library",
            description: error,
            icon: "auto",
            type: "danger"
          })
        });
      }
    } else {
      showMessage({
        message: "This workout has already been added to your library",
        icon: "auto",
        type: "info"
      })
    }
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchWorkoutsFromDatabase(() => {
      this.setState({ refreshing: false });
    });
  }
  render() {
    var discoverWorkoutViews;
    if (this.workouts.length > 0) {
      let style = this.state.darkTheme ? styles.workoutViewDark : styles.workoutViewLight;
      discoverWorkoutViews = []
      this.workouts.map((workout, index) => {
        const workoutCard =
          <Menu key={index} >
            <MenuTrigger
              triggerOnLongPress={true}
              customStyles={triggerMenuTouchable}
              onAlternativeAction={() => this.openWorkoutDetails(workout)} //because triggerOnLongPress triggers onPress, regular press triggers onAlternativeAction
            >
              <DiscoverItem workout={workout} onPress={(workout) => { this.openWorkoutDetails(workout) }} onPlayButtonClick={(workout) => this.playWorkout(workout)} style={style} />
            </MenuTrigger>
            <MenuOptions customStyles={popUpStyles}>
              <MenuOption text="Details" onSelect={() => this.openWorkoutDetails(workout)} />
              <MenuOption text="Add to my library" onSelect={() => this._addWorkoutToUserLib(workout)} />
              <MenuOption text="Share" onSelect={() => alert(`Share will be added soon`)} />
            </MenuOptions>
          </Menu>
        discoverWorkoutViews.push(workoutCard);
      })
    } else {
      discoverWorkoutViews = <ActivityIndicator size="small" color="#2172ff" />
    }
    const theme = getStyleSheet(this.state.darkTheme);
    return (
      <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
       
          <View style={styles.menuLight}>
            <Text>Filter</Text>
          </View>
          <ScrollView style={[ScreenStyles.screenContainer, styles.container]} showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
          >
            {discoverWorkoutViews}
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
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center"
  },
  workoutViewLight: {
    backgroundColor: '#2172ff',
    color: '#ffffff',
    marginBottom: 10
  },
  workoutViewDark: {
    backgroundColor: '#ffe417',
    color: '#000000',
    marginBottom: 10
  },
  menuLight: {
    padding: 5,
    width: '90%',
    left: '5%',
    alignItems: 'flex-end'
  }
});

const popUpStyles = {
  optionsContainer: {
    borderRadius: 6,
    width: 130
  }
};

const triggerMenuTouchable = { TriggerTouchableComponent: TouchableOpacity };


export default Discover;
