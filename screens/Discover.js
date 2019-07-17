import React, { Component } from "react";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import WorkoutCard from "../components/WorkoutCard";
import { SafeAreaView, View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Overlay } from 'react-native-elements'
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
        if (this.state.dataReceived) {
          this.setState({ refreshing: true })
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
          this.setState({ refreshing: false });
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
  shareWorkout(workout) {
    //Generate a unique id for this workout (random enough for us) [source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript]
    function uuidv4() {
      return (workout.name.replace(/\s/g, "") + 'xxxxxxyyxxx4xxxyxxx').replace(/[axy]/g, function (c) {
        var r = Math.random() * 32 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(32);
      });
    }
    //Store this workout at a location available for all user upon the request
    const timestamp = Number(moment().format('x'));
    const dataRef = firebase.database().ref("common/sharedWorkouts/");
    var newWorkoutRef = dataRef.push();
    //update props
    workout.timeCreated = timestamp;
    delete workout.added; //only needed it on this screen
    workout.refId = workout.id; //reference to Discover workout
    const id = uuidv4();
    workout.id = id; //update id (new unique Id)
    newWorkoutRef.set(workout).then(data => {
      alert("Show modal with the code to get this workout: " + id);
    }).catch(error => {
      showMessage({
        message: "Could not share this workout",
        description: error,
        icon: "auto",
        type: "danger"
      })
    });
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
              <WorkoutCard workout={workout} key={index} onPress={(workout) => { this.openWorkoutDetails(workout) }} onPlayButtonClick={(workout) => this.playWorkout(workout)} style={style} />
            </MenuTrigger>
            <MenuOptions customStyles={popUpStyles}>
              <MenuOption text="Details" onSelect={() => this.openWorkoutDetails(workout)} />
              <MenuOption text="Add to my library" onSelect={() => this._addWorkoutToUserLib(workout)} />
              <MenuOption text="Share" onSelect={() => this.shareWorkout(workout)} />
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
        <Overlay
          isVisible={this.state.isVisible}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="#ffffff"
          width="40%"
          height="auto"
          overlayStyle={styles.overlayStyle}
          onBackdropPress={() => this.setState({ isVisible: false })}
        >
          <Text>Almost done!</Text>
          <Text>The code to access this workout is ready to be sent</Text>
          <Text selectable="true">Code</Text>
        </Overlay>
        
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
  },
  overlayStyle: {
    backgroundColor: 'red'
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
