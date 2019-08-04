import React, { Component } from "react";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import WorkoutCard from "../components/WorkoutCard";
import { SafeAreaView, View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Clipboard } from "react-native";
import { Overlay, Icon, Button } from 'react-native-elements'
import getStyleSheet from "../styles/themestyles";
import { ScreenStyles, FontStyles } from '../styles/global';
import moment from 'moment';
import DatabaseManager from '../components/DatabaseManager';
import { showMessage } from "react-native-flash-message";

class Discover extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: global.darkTheme ? "#cfcfcf" : '#101010',
      headerStyle: {
        backgroundColor: getStyleSheet(global.darkTheme).background.backgroundColor
      },
      headerLeft: (
        <Button
          type="clear"
          icon={<Icon name="settings" size={22} color={global.darkTheme? '#cfcfcf' : '#101010'}/>}
          style={{ flexDirection: "row", alignSelf: "flex-end" }}
          onPress={() => navigation.navigate("Settings", {
            darkTheme: global.darkTheme
          })}
        />
      )
    };
  };

  constructor(props) {
    super(props)
    this.state = {
      darkTheme: global.darkTheme,
      refreshing: false,
      overlayVisible: false,
      sharedWorkoutCode: undefined
    }
    this.workouts = []

    //when returned to this screen check if props have changed 
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        if (this.state.darkTheme != global.darkTheme) {
          this.props.navigation.setParams({
            darkTheme: global.darkTheme
          });
          this.setState({ darkTheme: global.darkTheme });
        }
        // Do not fetch when the tab opens for the first time. 
        // Only do it if the user went back to this tab from another tab. 
        // In case if user deleted a Discover workout from their library, we need to remove a label from it on this tab
        if (this.state.dataReceived) {
          this.setState({ refreshing: true })
          this.refreshUserWorkouts(() => {
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


  fetchWorkoutsFromDatabase(onCompletion) {
    var wrks = []
    DatabaseManager.GetAllWorkoutRefsOnce().then( (workoutRefs) => {
      if (workoutRefs && workoutRefs.length > 0) {
        DatabaseManager.GetCurrentUserSavedDiscoverWorkouts().then(references => {
          workoutRefs.forEach(workoutRef => {
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
      }
    });
  }

  refreshUserWorkouts(onCompletion) {
    DatabaseManager.GetCurrentUserSavedDiscoverWorkouts().then(references => {
      if (references && references.length > 0) {
        this.workouts.forEach(workout => {
          //check if the discover workout was added to the user library
            workout.added = references.includes(workout.id);
          });
      }
      onCompletion();
    });
  }
  openWorkoutDetails(workout) {
    this.props.navigation.navigate('WorkoutDetails', { workout: workout, discoverWorkout: true, darkTheme: global.darkTheme });
  }
  playWorkout(workout) {
    this.props.navigation.navigate('RunWorkout', { workout: workout, darkTheme: global.darkTheme });
  }
  _addWorkoutToUserLib(workout) {
    if (!workout.added) {
      //update props
      workout.timeCreated = Number(moment().format('x'));
      delete workout.added; //only needed it on this screen
      workout.refId = workout.id; //reference to Discover workout
      DatabaseManager.AddWorkoutToUserLibrary(workout).then( () => {
        showMessage({
          message: "Workout was added to your library",
          icon: "auto",
          type: "success"
        });
        workout.added = true;
        this.setState({ refreshing: false });
      }).catch(error => {
        showMessage({
          message: "Could not add workout to your library",
          description: error,
          icon: "auto",
          type: "danger"
        });
      });
    }
    else {
      showMessage({
        message: "This workout has already been added to your library",
        icon: "auto",
        type: "info"
      });
    }
  }
  shareWorkout(workout) {
    delete workout.added;
    DatabaseManager.AddWorkoutToSharedDirectory(workout).then(id => {
      this.setState({ sharedWorkoutCode: id, overlayVisible: true })
    }).catch(error => {
      showMessage({
        message: "Could not share this workout",
        description: error,
        icon: "auto",
        type: "danger"
      })
    })
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
        <ScrollView style={[ScreenStyles.screenContainer, styles.container]} showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
        >
          {discoverWorkoutViews}
        </ScrollView>
        <Overlay
          isVisible={this.state.overlayVisible}
          windowBackgroundColor="rgba(0, 0, 0, .4)"
          height="auto"
          overlayStyle={styles.overlayStyle}
          onBackdropPress={() => this.setState({ overlayVisible: false })}
        >
          <View style={{ alignItems: 'center' }} >
            <Text style={[FontStyles.h1, { marginTop: 5 }]}>Almost done!</Text>
            <Text style={[FontStyles.default, { marginTop: 5, textAlign: 'center' }]}>The code to access this workout is ready to be sent</Text>
            <View style={{ marginTop: 15, flexDirection: "row", width: "80%", alignSelf: 'center', alignItems: 'center' }}>
              <Text selectable={true} style={{ textAlign: 'center', backgroundColor: '#f2f2f2', textAlign: 'center', padding: 5, borderRadius: 5, borderWidth: 1, borderColor: '#e0e0e0' }}>{this.state.sharedWorkoutCode}</Text>
              <Button
                type="clear"
                title="copy "
                iconRight
                icon={
                  <Icon type="material-community" name="content-copy" size={16} color={theme.text.color} />
                }
                style={{ alignSelf: "flex-end", fontSize: 13 }}
                titleStyle={FontStyles.default}
                onPress={() => {
                  Clipboard.setString(this.state.sharedWorkoutCode);
                  showMessage({
                    message: "Code copied",
                    icon: "auto",
                    type: "success"
                  })
                }}
              />
            </View>
          </View>
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
    width: "80%",
    top: "-10%",
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    alignContent: 'center',
    alignItems: 'center'
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
