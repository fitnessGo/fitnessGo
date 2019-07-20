import React, { Component } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  TextInput, Clipboard
} from "react-native";
import { Button, Icon, Overlay } from "react-native-elements";
import WorkoutCard from "../components/WorkoutCard";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger, renderers
} from "react-native-popup-menu";
import getStyleSheet from "../styles/themestyles";
import { ScreenStyles, FontStyles } from "../styles/global";
import firebase from "react-native-firebase";
import DatabaseManager from "../components/DatabaseManager";
import { showMessage } from "react-native-flash-message";
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
      workouts: [],
      getSharedWorkoutOverlayVisible: false,
      shareWorkoutOverlayVisible: false,
      sharedWorkoutCode: undefined,
      overlayErrorMessage: ""
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
  shareWorkout(workout) {
    DatabaseManager.AddWorkoutToSharedDirectory(workout).then(id => {
      this.setState({ sharedWorkoutCode: id, shareWorkoutOverlayVisible: true })
    }).catch(error => {
      showMessage({
        message: "Could not share this workout",
        description: error,
        icon: "auto",
        type: "danger"
      })
    })
  }
  addSharedWorkout(code) {
    //check if code is not empty
    if (code && code.length) {
      DatabaseManager.GetSharedWorkout(code).then((workout) => {
        if (workout) {
          this.setState({ getSharedWorkoutOverlayVisible: false, overlayErrorMessage: "" })
          this.props.navigation.navigate('WorkoutDetails', { workout: workout, discoverWorkout: true });
        } else {
          //Not foiund in the database, maybe wrong code
          this.setState({ overlayErrorMessage: "Workout with this code not found" })
        }
      });
    }
    //Code not entered
    else {
      this.setState({ overlayErrorMessage: "Code not entered" })
    }
    this.sharedWorkoutCode = undefined
  }
  //Open view and prompt a workoud code from user 
  addSharedWorkoutButtonPressed() {
    this.setState({ getSharedWorkoutOverlayVisible: true })
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
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={[theme.text, { textAlign: 'center' }]}>
                Click + to create a new workout or find more in the Discover Tab
              </Text>
              <Menu renderer={renderers.Popover} rendererProps={{ preferredPlacement: 'top' }}>
                <MenuTrigger triggerOnLongPress={true} onAlternativeAction={() => this._onCreateNewButtonClick(this.state.workouts)} customStyles={triggerMenuTouchable}>
                  <View style={{ padding: "1%" }}>
                    <Icon name="add-circle" size={44} color={theme.text.color} />
                  </View>
                </MenuTrigger>
                <MenuOptions customStyles={popUpStyles}>
                  <MenuOption text="Add shared workout" onSelect={() =>
                    this.addSharedWorkoutButtonPressed()} />
                </MenuOptions>
              </Menu>
            </View>
          </ScrollView>
          {/* Add shared workout overlay */}
        <Overlay
          isVisible={this.state.getSharedWorkoutOverlayVisible}
          windowBackgroundColor="rgba(0, 0, 0, .4)"
          height="auto"
          overlayStyle={styles.overlayStyle}
          onBackdropPress={() => {
            this.setState({ getSharedWorkoutOverlayVisible: false, overlayErrorMessage: "" });
            this.code = undefined;
          }}
        >
          <View style={{ alignItems: 'center' }} >
            <Text style={[FontStyles.h1, { marginTop: 5 }]}>Open shared workout</Text>
            <Text style={[FontStyles.default, { marginTop: 5, textAlign: 'center' }]}>Please enter the code: </Text>

            {
              this.state.overlayErrorMessage !== "" &&
              <Text style={[FontStyles.warn, { marginTop: 5, textAlign: 'center' }]}>{this.state.overlayErrorMessage}</Text>
            }


            <View style={{ marginTop: 15, flexDirection: "row", width: "80%", alignSelf: 'center', alignItems: 'center' }} >
              <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>
                <TextInput
                  underlineColorAndroid="transparent"
                  onChangeText={code => this.sharedWorkoutCode = code}
                  placeholder="Code "
                  style={[theme.text]}
                  onSubmitEditing={() =>
                    this.addSharedWorkout(this.sharedWorkoutCode)
                  }
                >
                </TextInput>
                <Button
                  type="outline"
                  title="enter "
                  titleStyle={FontStyles.default}
                  onPress={() => {
                    this.addSharedWorkout(this.sharedWorkoutCode);
                  }}
                />
              </View>
            </View>
          </View>
        </Overlay>
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
                      text="Share"
                      onSelect={() => this.shareWorkout(w)}
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
          <Menu renderer={renderers.Popover} rendererProps={{ preferredPlacement: 'top' }}>
            <MenuTrigger triggerOnLongPress={true} onAlternativeAction={() => this._onCreateNewButtonClick(this.state.workouts)} customStyles={triggerMenuTouchable}>
              <View style={{ padding: "1%" }}>
                <Icon name="add-circle" size={44} color={theme.text.color} />
              </View>
            </MenuTrigger>
            <MenuOptions customStyles={popUpStyles}>
              <MenuOption text="Add shared workout" onSelect={() =>
                this.addSharedWorkoutButtonPressed()} />
            </MenuOptions>
          </Menu>

        </View>
        {/* Share workout overlay */}
        <Overlay
          isVisible={this.state.shareWorkoutOverlayVisible}
          windowBackgroundColor="rgba(0, 0, 0, .4)"
          height="auto"
          overlayStyle={styles.overlayStyle}
          onBackdropPress={() => this.setState({ shareWorkoutOverlayVisible: false })}
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
        {/* Add shared workout overlay */}
        <Overlay
          isVisible={this.state.getSharedWorkoutOverlayVisible}
          windowBackgroundColor="rgba(0, 0, 0, .4)"
          height="auto"
          overlayStyle={styles.overlayStyle}
          onBackdropPress={() => {
            this.setState({ getSharedWorkoutOverlayVisible: false, overlayErrorMessage: "" });
            this.code = undefined;
          }}
        >
          <View style={{ alignItems: 'center' }} >
            <Text style={[FontStyles.h1, { marginTop: 5 }]}>Open shared workout</Text>
            <Text style={[FontStyles.default, { marginTop: 5, textAlign: 'center' }]}>Please enter the code: </Text>

            {
              this.state.overlayErrorMessage !== "" &&
              <Text style={[FontStyles.warn, { marginTop: 5, textAlign: 'center' }]}>{this.state.overlayErrorMessage}</Text>
            }


            <View style={{ marginTop: 15, flexDirection: "row", width: "80%", alignSelf: 'center', alignItems: 'center' }} >
              <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>
                <TextInput
                  underlineColorAndroid="transparent"
                  onChangeText={code => this.sharedWorkoutCode = code}
                  placeholder="Code "
                  style={[theme.text]}
                  onSubmitEditing={() =>
                    this.addSharedWorkout(this.sharedWorkoutCode)
                  }
                >
                </TextInput>
                <Button
                  type="outline"
                  title="enter "
                  titleStyle={FontStyles.default}
                  onPress={() => {
                    this.addSharedWorkout(this.sharedWorkoutCode);
                  }}
                />
              </View>
            </View>
          </View>
        </Overlay>
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
    width: 160
  }
};

const triggerMenuTouchable = { TriggerTouchableComponent: TouchableOpacity };

export default HomeScreen;
