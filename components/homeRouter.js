import React from "react";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from "react-navigation";
import { Icon } from "react-native-elements";
//Import screens
import LogInOptionsScreen from "../screens/LogInOptions";
import CreateAccount from "../screens/CreateAccount";
import StartScreen from "../screens/Start";
import HomeScreen from "../screens/Home";
import SettingsScreen from "../screens/Settings";
import WorkoutDetails from "../screens/WorkoutDetails";
import RunWorkoutScreen from "../screens/RunWorkout/RunWorkoutScreen";
import Discover from "../screens/Discover";
import CreateWorkoutScreen from "../screens/CreateWorkout";
import AboutScreen from "../screens/About";
import getStyleSheet from "../styles/themestyles";
//More about navigation https://reactnavigation.org/docs/en/auth-flow.html
//createStackNavigator is a function that takes a route configuration object and an options object and returns a React component.
const WorkoutStack = createStackNavigator(
  {
    UserLibrary: {
      screen: HomeScreen,
      navigationOptions: {
        title: "Home"
      }
    },
    Settings: SettingsScreen,
    AboutScreen: AboutScreen,
    WorkoutDetails: {
      screen: WorkoutDetails,
      navigationOptions: {
        title: "Details",
        headerMode: "none",
        mode: "modal"
      }
    },
    RunWorkout: {
      screen: RunWorkoutScreen,
      navigationOptions: {
        title: "Play workout"
      }
    },
    CreateWorkout: {
      screen: CreateWorkoutScreen,
      navigationOptions: {
        title: "Create Workout"
      }
    }
  },
  {
    mode: "modal"
  }
);

const DiscoverStack = createStackNavigator(
  {
    DiscoverScreen: {
      screen: Discover,
      navigationOptions: {
        title: "Discover"
      }
    },
    WorkoutDetails: {
      screen: WorkoutDetails,
      navigationOptions: {
        title: "Details"
      }
    },
    RunWorkout: {
      screen: RunWorkoutScreen,
      navigationOptions: {
        title: "Play workout"
      }
    },
    Settings: SettingsScreen,
    AboutScreen: AboutScreen,
  },
  {
    mode: "modal",
    cardStyle: {
      opacity: 1.0
    },
    transparentCard: false
  }
);
const AuthStack = createStackNavigator(
  { SignIn: LogInOptionsScreen, Register: CreateAccount },
  { headerMode: "none" }
);

const TabNavigator = createBottomTabNavigator({
  WorkoutStack: {
    screen: WorkoutStack,
    navigationOptions: {
       tabBarIcon: ({ tintColor }) => {
        const iconName = "home"
        return <Icon name={iconName} size={30} color={tintColor} />;
       } 
    }
  },
  Discover: {
    screen: DiscoverStack,
    navigationOptions: {
       tabBarIcon: ({ tintColor }) => {
        const iconName = "md-compass"
        return <Icon name={iconName} type="ionicon" size={30} color={tintColor} />;
       } 
    }
  },
},
{
  tabBarOptions: {
    activeTintColor: '#000000',
    inactiveTintColor: '#999999',
    style: {
      backgroundColor: getStyleSheet(window.darkTheme).background.backgroundColor
    },
  }
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Start: StartScreen,
      App: TabNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: "Start"
    }
  )
);
