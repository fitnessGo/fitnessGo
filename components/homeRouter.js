import React from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
//Import screens
import LogInOptionsScreen from "../screens/LogInOptions";
import CreateAccount from "../screens/CreateAccount";
import StartScreen from "../screens/Start";
import HomeScreen from "../screens/Home"
import SettingsScreen from "../screens/Settings";
import WorkoutDetails from "../screens/WorkoutDetails"
import Discover from "../screens/Discover";

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
    WorkoutDetails: {
      screen: WorkoutDetails,
      navigationOptions: {
        title: "Details"
      }
    }
  }, {
    initialRoute: 'UserLibrary',
  });

const DiscoverStack = createStackNavigator({
  DiscoverScreen: {
    screen: Discover,
    navigationOptions: {
      title: "Discover"
    }
  }
})
const AuthStack = createStackNavigator({ SignIn: LogInOptionsScreen, Register: CreateAccount });

const TabNavigator = createBottomTabNavigator(
  {
    WorkoutStack: {
      screen: WorkoutStack,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: () => (
          <Icon name="home" size={22} />
        )
      }
    },
    Discover: {
      screen: DiscoverStack,
      navigationOptions: {
        tabBarLabel: 'Discover',
        tabBarIcon: () => (
          <Icon name="md-compass" type='ionicon' size={22} />
        )
      }
    }
  })

export default createAppContainer(
  createSwitchNavigator(
    {
      Start: StartScreen,
      App: TabNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'App',
    })
);