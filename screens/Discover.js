import React, { Component } from "react";
import DiscoverItem from "../components/DiscoverItem";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaView, View, ScrollView, Text, StyleSheet } from "react-native";
import getStyleSheet from "../styles/themestyles";
import { ScreenStyles } from '../styles/global';

import firebase from 'react-native-firebase';

class Discover extends Component {
  constructor(props) {
    super(props)
    this.state = {
      darkTheme: window.darkTheme
    }
    this.workouts = []

    //when returned to this screen check if props have changed 
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        if (this.state.darkTheme != window.darkTheme) {
          this.setState({ darkTheme: window.darkTheme });
        }
      }
    );
    this._onWorkoutSelect = this._onWorkoutSelect.bind(this);
  }
  componentDidMount() {
    this.fetchWorkoutsFromDatabase();
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
  getUserSavedDiscoverWorkouts() {
    const user = firebase.auth().currentUser;
      if (user) {
        const userDataRef = firebase.database().ref("users/" + user.uid + "/workouts/").once('value').then((snapshot) => {
          var references = []
          snapshot.forEach(function (workoutRef) {
            const w = workoutRef.val();
            if(w.refId)
            references.push(w.refId)
          });
         return references;
        });
      } else {
        return null;
      }
  }
  fetchWorkoutsFromDatabase() {
    firebase.database().ref('/common/workouts/').once('value').then((snapshot) => {
      var wrks = []
      const discoverRefs = this.getUserSavedDiscoverWorkouts();
      snapshot.forEach(function (workoutRef) {
        var workout = workoutRef.val();
        //check if the discover workout was added to the user library
        if(discoverRefs)
          workout.added = discoverRefs.includes(workout.refId);
        wrks.push(workout)
      });
      this.workouts = wrks
      this.setState({ dataReceived: true })
    });
  }
  _onWorkoutSelect(workout) {
    this.props.navigation.navigate('WorkoutDetails', { workout: workout, discoverWorkout: true });
  }
  _onPlayButtonClick(w) {
    this.props.navigation.navigate('RunWorkout', { workout: w });
  }
  render() {
    var discoverWorkoutViews;
    if (this.workouts.length > 0) {
      let style = this.state.darkTheme ? styles.workoutViewDark : styles.workoutViewLight;
      discoverWorkoutViews = []
      this.workouts.map( (workout, index) => { 
        discoverWorkoutViews.push(<DiscoverItem workout={workout} key={index} onPress={(workout) => { this._onWorkoutSelect(workout) }} onPlayButtonClick={(workout) => this._onPlayButtonClick(workout)} style={style} />)
      })
    } else {
      discoverWorkoutViews = <Text>Loading...</Text>
    }
    const theme = getStyleSheet(this.state.darkTheme);
    return (
      <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
        <MenuProvider>
          <View style={styles.menuLight}>
            <Text>Filter</Text>
          </View>
          <ScrollView style={[ScreenStyles.screenContainer, styles.container]} showsVerticalScrollIndicator={false}>
            {discoverWorkoutViews}
          </ScrollView>
        </MenuProvider>
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

export default Discover;
