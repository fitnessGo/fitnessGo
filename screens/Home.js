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
  Dimensions,
  Image,
  TextInput,
  Clipboard
} from "react-native";
import { Button, Icon, Overlay } from "react-native-elements";
import WorkoutCard from "../components/WorkoutCard";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from "react-native-popup-menu";
import getStyleSheet from "../styles/themestyles";
import { ScreenStyles, FontStyles } from "../styles/global";
import firebase from "react-native-firebase";
import DatabaseManager from "../components/DatabaseManager";
import { showMessage } from "react-native-flash-message";
import AppIntroSlider from "react-native-app-intro-slider";

const tutorialSlides = [
  {
    key: "slide1",
    title: "Welcome to FitnessGo!",
    text:
      "FitnessGo allows you to create custom workouts, discover workouts from other people, and share your workouts with your friends.",
    image: require("../assets/images/main/Stopwatch.png")
  },
  {
    key: "slide2",
    title: "Create workouts",
    text: "Press plus button to create a workout",
    image: require("../assets/images/tutorial/1.png")
  },
  {
    key: "slide3",
    title: "Add your exercises",
    text:
      'Type in a workout name, select a workout category, and add an exercise by selecting an exercise name. Create sets by entering a duration, break, and number of repetitions. When done, simply press "Save" button on top right corner.',
    image: require("../assets/images/tutorial/2.png")
  },
  {
    key: "slide4",
    title: "User library",
    text:
      "You'll see your newly created workout on the \"Home\" screen as well as all of your previously added workouts.",
    image: require("../assets/images/tutorial/3.png")
  },
  {
    key: "slide5",
    title: "Workout details",
    text:
      'You can see workout details by simply clicking on the workout on the \"Home\" screen. If you want to edit your workout, press the "Edit" button on top right corner.',
    image: require("../assets/images/tutorial/4.png")
  },
  {
    key: "slide6",
    title: "Edit workout",
    text:
      "Edit your workout to change the workout name, category, exercises and sets by simply editing the text fields.",
    image: require("../assets/images/tutorial/5.png")
  },
  {
    key: "slide7",
    title: "Play workout",
    text:
      'Start a workout by pressing the "Play" button in the bottom right corner of the workout card on the "Home" screen',
    image: require("../assets/images/tutorial/6.png")
  },
  {
    key: "slide8",
    title: "Play workout",
    text:
      "You can play, pause, and switch between exercise timers by using the play controls on the bottom of the screen.",
    image: require("../assets/images/tutorial/7.png")
  },
  {
    key: "slide9",
    title: "Discover workouts",
    text:
      'Discover workouts from famous athletes and local gyms on the "Discover" tab.',
    image: require("../assets/images/tutorial/8.png")
  },
  {
    key: "slide10",
    title: "Discover workouts",
    text:
      'Long press a workout card to see additional actions such as "Add to Library", "Share", and "Details".',
    image: require("../assets/images/tutorial/9.png")
  },
  {
    key: "slide11",
    title: "Share workouts",
    text:
      'Click "Share" to get a code you can send to easily share your workout.',
    image: require("../assets/images/tutorial/10.png")
  },
  {
    key: "slide12",
    title: "Add shared workouts",
    text:
      'In order to see a workout somebody shared with you press and hold the "Plus" button in the bottom corner and select "Add shared workout".',
    image: require("../assets/images/tutorial/11.png")
  },
  {
    key: "slide13",
    title: "Add shared workouts",
    text:
      "Enter a workout code you received to open a shared workout.",
    image: require("../assets/images/tutorial/12.png")
  }
];

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "My App",
      headerTintColor: global.darkTheme ? "#cfcfcf" : "#101010",
      headerStyle: {
        backgroundColor: getStyleSheet(global.darkTheme).background
          .backgroundColor
      },
      headerLeft: (
        <Button
          type="clear"
          icon={
            <Icon
              name="settings"
              size={22}
              color={global.darkTheme ? "#cfcfcf" : "#101010"}
            />
          }
          style={{ flexDirection: "row", alignSelf: "flex-end" }}
          onPress={() =>
            navigation.navigate("Settings", {
              darkTheme: global.darkTheme
            })
          }
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      darkTheme: global.darkTheme,
      dataReady: true,
      refreshing: false,
      workouts: [],
      getSharedWorkoutOverlayVisible: false,
      shareWorkoutOverlayVisible: false,
      sharedWorkoutCode: undefined,
      overlayErrorMessage: "",
      showTutorial: false
    };
    this._onWorkoutSelect = this._onWorkoutSelect.bind(this);
    this._onCreateNewButtonClick = this._onCreateNewButtonClick.bind(this);
    this.updateWorkouts = this.updateWorkouts.bind(this);

    //when returned to this screen check if props have changed
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        if (this.state.darkTheme != global.darkTheme) {
          this.props.navigation.setParams({
            darkTheme: global.darkTheme
          });
          this.setState({ darkTheme: global.darkTheme });
        }
      }
    );
    this.localData = null; // or this
  }

  componentDidMount() {
    this.fetchUserWorkouts(workouts => {
      this.setState({ workouts: workouts });
    });

    const user = firebase.auth().currentUser;
    if (user) {
      const firstTimeRef = firebase
        .database()
        .ref("users/" + user.uid + "/firstTime")
        .on("value", firstTime => {
          if (firstTime === true || firstTime.val() === null) {
            this.setState({ showTutorial: true });
          }
        });
    }
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
      update: this.updateWorkouts,
      darkTheme: global.darkTheme
    });
  }
  _onWorkoutUpdate() {
    // this.selectedWorkout.forceUpdate();
  }
  _onWorkoutSelect(w, view) {
    this.selectedWorkout = view;
    this.props.navigation.navigate("WorkoutDetails", {
      workout: w,
      finishedEditing: this._onWorkoutUpdate.bind(this),
      darkTheme: global.darkTheme
    });
  }
  _onPlayButtonClick(w) {
    this.props.navigation.navigate("RunWorkout", {
      workout: w,
      darkTheme: global.darkTheme
    });
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

  _renderItem = ({ item }) => {
    return (
      <View style={tutorialStyles.slide}>
        <Text style={tutorialStyles.title}>{item.title}</Text>
        <Image style={tutorialStyles.image} source={item.image} />
        <Text style={tutorialStyles.text}>{item.text}</Text>
      </View>
    );
  };

  _renderNextButton = () => {
    return <Text style={tutorialStyles.button}>Next</Text>;
  };
  _renderDoneButton = () => {
    return <Text style={tutorialStyles.button}>Done</Text>;
  };
  _renderSkipButton = () => {
    return <Text style={tutorialStyles.button}>Skip</Text>;
  };

  _onDone = () => {
    this.setState({ showTutorial: false });
    const user = firebase.auth().currentUser;
    if (user) {
      firebase
        .database()
        .ref("users/" + user.uid + "/firstTime")
        .set(false);
    } else {
    }
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
    DatabaseManager.AddWorkoutToSharedDirectory(workout)
      .then(id => {
        this.setState({
          sharedWorkoutCode: id,
          shareWorkoutOverlayVisible: true
        });
      })
      .catch(error => {
        showMessage({
          message: "Could not share this workout",
          description: error,
          icon: "auto",
          type: "danger"
        });
      });
  }
  addSharedWorkout(code) {
    //check if code is not empty
    if (code && code.length) {
      DatabaseManager.GetSharedWorkout(code).then(workout => {
        if (workout) {
          this.setState({
            getSharedWorkoutOverlayVisible: false,
            overlayErrorMessage: ""
          });
          this.props.navigation.navigate("WorkoutDetails", {
            workout: workout,
            discoverWorkout: true,
            darkTheme: global.darkTheme
          });
        } else {
          //Not foiund in the database, maybe wrong code
          this.setState({
            overlayErrorMessage: "Workout with this code not found"
          });
        }
      });
    }
    //Code not entered
    else {
      this.setState({ overlayErrorMessage: "Code not entered" });
    }
    this.sharedWorkoutCode = undefined;
  }
  //Open view and prompt a workoud code from user
  addSharedWorkoutButtonPressed() {
    this.setState({ getSharedWorkoutOverlayVisible: true });
  }
  render() {
    const theme = getStyleSheet(this.state.darkTheme);
    const workoutViewStyle = this.state.darkTheme
      ? styles.workoutViewDark
      : styles.workoutViewLight;
    if (this.state.showTutorial === true) {
      return (
        <AppIntroSlider
          renderItem={this._renderItem}
          slides={tutorialSlides}
          onDone={this._onDone}
          showSkipButton
          onSkip={this._onDone}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          renderSkipButton={this._renderSkipButton}
        />
      );
    } else if (!this.state.workouts || this.state.workouts.length == 0) {
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
              <Text style={[theme.text, { textAlign: "center" }]}>
                Click + to create a new workout or find more in the Discover Tab
              </Text>
              <Menu
                renderer={renderers.Popover}
                rendererProps={{ preferredPlacement: "top" }}
              >
                <MenuTrigger
                  triggerOnLongPress={true}
                  onAlternativeAction={() =>
                    this._onCreateNewButtonClick(this.state.workouts)
                  }
                  customStyles={triggerMenuTouchable}
                >
                  <View style={{ padding: "1%" }}>
                    <Icon
                      name="add-circle"
                      size={44}
                      color={theme.text.color}
                    />
                  </View>
                </MenuTrigger>
                <MenuOptions customStyles={popUpStyles}>
                  <MenuOption
                    text="Add shared workout"
                    onSelect={() => this.addSharedWorkoutButtonPressed()}
                  />
                </MenuOptions>
              </Menu>
            </View>
          </ScrollView>
          <View style={styles.scaleImageContainer}>
            <Image
              resizeMode={"contain"}
              source={require("../assets/images/main/ScalesBottleMat.png")}
              style={styles.containerImage}
            />
          </View>
          <View style={styles.stopwatchImageContainer}>
            <Image
              resizeMode={"contain"}
              source={require("../assets/images/main/Stopwatch.png")}
              style={[styles.containerImage]}
            />
          </View>
          <View style={styles.weigthImageContainer}>
            <Image
              resizeMode={"contain"}
              source={require("../assets/images/main/Weights.png")}
              style={styles.containerImage}
            />
          </View>
          {/* Add shared workout overlay */}
          <Overlay
            isVisible={this.state.getSharedWorkoutOverlayVisible}
            windowBackgroundColor="rgba(0, 0, 0, .4)"
            height="auto"
            overlayStyle={styles.overlayStyle}
            onBackdropPress={() => {
              this.setState({
                getSharedWorkoutOverlayVisible: false,
                overlayErrorMessage: ""
              });
              this.code = undefined;
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={[FontStyles.h1, { marginTop: 5 }]}>
                Open shared workout
              </Text>
              <Text
                style={[
                  FontStyles.default,
                  { marginTop: 5, textAlign: "center" }
                ]}
              >
                Please enter the code:{" "}
              </Text>

              {this.state.overlayErrorMessage !== "" && (
                <Text
                  style={[
                    FontStyles.warn,
                    { marginTop: 5, textAlign: "center" }
                  ]}
                >
                  {this.state.overlayErrorMessage}
                </Text>
              )}

              <View
                style={{
                  marginTop: 15,
                  flexDirection: "row",
                  width: "80%",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around"
                  }}
                >
                  <TextInput
                    underlineColorAndroid="transparent"
                    onChangeText={code => (this.sharedWorkoutCode = code)}
                    placeholder="Code "
                    style={[theme.text]}
                    onSubmitEditing={() =>
                      this.addSharedWorkout(this.sharedWorkoutCode)
                    }
                  />
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
                    onAlternativeAction={view => this._onWorkoutSelect(w, view)}
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
          <Menu
            renderer={renderers.Popover}
            rendererProps={{ preferredPlacement: "top" }}
          >
            <MenuTrigger
              triggerOnLongPress={true}
              onAlternativeAction={() =>
                this._onCreateNewButtonClick(this.state.workouts)
              }
              customStyles={triggerMenuTouchable}
            >
              <View style={{ padding: "1%" }}>
                <Icon name="add-circle" size={44} color={theme.text.color} />
              </View>
            </MenuTrigger>
            <MenuOptions customStyles={popUpStyles}>
              <MenuOption
                text="Add shared workout"
                onSelect={() => this.addSharedWorkoutButtonPressed()}
              />
            </MenuOptions>
          </Menu>
        </View>
        {/* Share workout overlay */}
        <Overlay
          isVisible={this.state.shareWorkoutOverlayVisible}
          windowBackgroundColor="rgba(0, 0, 0, .4)"
          height="auto"
          overlayStyle={styles.overlayStyle}
          onBackdropPress={() =>
            this.setState({ shareWorkoutOverlayVisible: false })
          }
        >
          <View style={{ alignItems: "center" }}>
            <Text style={[FontStyles.h1, { marginTop: 5 }]}>Almost done!</Text>
            <Text
              style={[
                FontStyles.default,
                { marginTop: 5, textAlign: "center" }
              ]}
            >
              The code to access this workout is ready to be sent
            </Text>
            <View
              style={{
                marginTop: 15,
                flexDirection: "row",
                width: "80%",
                alignSelf: "center",
                alignItems: "center"
              }}
            >
              <Text
                selectable={true}
                style={{
                  textAlign: "center",
                  backgroundColor: "#f2f2f2",
                  textAlign: "center",
                  padding: 5,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#e0e0e0"
                }}
              >
                {this.state.sharedWorkoutCode}
              </Text>
              <Button
                type="clear"
                title="copy "
                iconRight
                icon={
                  <Icon
                    type="material-community"
                    name="content-copy"
                    size={16}
                    color={theme.text.color}
                  />
                }
                style={{ alignSelf: "flex-end", fontSize: 13 }}
                titleStyle={FontStyles.default}
                onPress={() => {
                  Clipboard.setString(this.state.sharedWorkoutCode);
                  showMessage({
                    message: "Code copied",
                    icon: "auto",
                    type: "success"
                  });
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
            this.setState({
              getSharedWorkoutOverlayVisible: false,
              overlayErrorMessage: ""
            });
            this.code = undefined;
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={[FontStyles.h1, { marginTop: 5 }]}>
              Open shared workout
            </Text>
            <Text
              style={[
                FontStyles.default,
                { marginTop: 5, textAlign: "center" }
              ]}
            >
              Please enter the code:{" "}
            </Text>

            {this.state.overlayErrorMessage !== "" && (
              <Text
                style={[FontStyles.warn, { marginTop: 5, textAlign: "center" }]}
              >
                {this.state.overlayErrorMessage}
              </Text>
            )}

            <View
              style={{
                marginTop: 15,
                flexDirection: "row",
                width: "80%",
                alignSelf: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <TextInput
                  underlineColorAndroid="transparent"
                  onChangeText={code => (this.sharedWorkoutCode = code)}
                  placeholder="Code "
                  style={[theme.text]}
                  onSubmitEditing={() =>
                    this.addSharedWorkout(this.sharedWorkoutCode)
                  }
                />
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
const win = Dimensions.get("window");
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
    alignSelf: "stretch"
  },
  scaleImageContainer: {
    position: "absolute",
    bottom: "20%",
    left: "-10%",
    width: "55%",
    aspectRatio: 1,
    justifyContent: "center",
    padding: 0,
    transform: [{ rotateY: "180deg" }]
  },
  stopwatchImageContainer: {
    position: "absolute",
    bottom: "45%",
    right: "-5%",
    width: "32%",
    aspectRatio: 1,
    justifyContent: "center",
    transform: [{ rotate: "-25deg" }]
  },
  weigthImageContainer: {
    position: "absolute",
    bottom: "-6%",
    right: "-12%",
    width: "50%",
    aspectRatio: 1,
    justifyContent: "center",
    padding: 15,
    transform: [{ rotate: "-20deg" }]
  },
  overlayStyle: {
    width: "80%",
    top: "-10%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    alignContent: "center",
    alignItems: "center"
  }
});

const popUpStyles = {
  optionsContainer: {
    borderRadius: 6,
    width: 160
  }
};

const tutorialStyles = StyleSheet.create({
  image: {
    width: 200,
    height: 350,
    resizeMode: "contain"
  },
  text: {
    color: "#000",
    textAlign: "center",
    paddingHorizontal: 16,
    marginBottom: 100
  },
  title: {
    fontSize: 22,
    color: "#000",
    backgroundColor: "transparent",
    textAlign: "center",
    marginBottom: 0
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff"
  },
  button: {
    fontSize: 18,
    color: "#007AFF",
    marginTop: 40
  }
});

const triggerMenuTouchable = { TriggerTouchableComponent: TouchableOpacity };

export default HomeScreen;
