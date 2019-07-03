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
  }
  componentDidMount() {
    this.fetchWorkoutsFromDatabase()
  }
  fetchWorkoutsFromDatabase() {
    firebase.database().ref('/common/workouts/').once('value').then((snapshot) => {
      var wrks = []
      snapshot.forEach(function (workout) {
        wrks.push(workout.val())
      });
      this.workouts = wrks
      this.setState({ dataReceived: true })
    });
  }
  render() {
    var discoverWorkoutViews;
    if (this.workouts.length > 0) {
      let style = this.state.darkTheme ? styles.workoutViewDark : styles.workoutViewLight;
      discoverWorkoutViews = []
      this.workouts.forEach(function (workout, index) {
        discoverWorkoutViews.push(<DiscoverItem workout={workout} key={index} onPress={(index) => { this.onTimerSelect(index) }} style={style} />)
      });
    } else {
      discoverWorkoutViews = <Text>Add spinner</Text>
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
