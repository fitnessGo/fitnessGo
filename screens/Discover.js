import React, { Component } from "react";
import DiscoverItem from "../components/DiscoverItem";
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from "react-native-popup-menu";
import { SafeAreaView, View, ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
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
  openWorkoutDetails(workout){
    this.props.navigation.navigate('WorkoutDetails', { workout: workout, discoverWorkout: true });
  }
  _onWorkoutSelect(workout) {
    openWorkoutDetails(workout)
  }
  playWorkout(workout) {
    this.props.navigation.navigate('RunWorkout', { workout: workout });
  }
  _addWorkoutToUserLib() {
    
  }
  render() {
    var discoverWorkoutViews;
    if (this.workouts.length > 0) {
      let style = this.state.darkTheme ? styles.workoutViewDark : styles.workoutViewLight;
      discoverWorkoutViews = []
      this.workouts.map( (workout, index) => { 
        const workoutCard = 
        <Menu>
          <MenuTrigger
            triggerOnLongPress={true}
            customStyles={triggerMenuTouchable}
            onAlternativeAction={this.onPress} //because triggerOnLongPress triggers onPress, regular press triggers onAlternativeAction
          >
            <DiscoverItem workout={workout} key={index} onPress={(workout) => { this._onWorkoutSelect(workout) }} onPlayButtonClick={(workout) => this.playWorkout(workout)} style={style} />
            </MenuTrigger>
          <MenuOptions customStyles={popUpStyles}>
            <MenuOption text="Details" onSelect={() => this.openWorkoutDetails(workout)} />
            <MenuOption text="Play" onSelect={() => this.playWorkout(workout) } />
            <MenuOption text="Add to my library" onSelect={() => this._addWorkoutToUserLib(workout)} />
            <MenuOption text="Share" onSelect={() => alert(`Share will be added soon`)} />
          </MenuOptions>
        </Menu>
        discoverWorkoutViews.push(workoutCard);
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

const popUpStyles = {
  optionsContainer: {
    borderRadius: 6,
    width: 130
  }
};

const triggerMenuTouchable = { TriggerTouchableComponent: TouchableOpacity };


export default Discover;
