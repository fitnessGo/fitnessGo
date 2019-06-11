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

const TabNavigator = createBottomTabNavigator(
  { 
    Home: {
      screen:HomeScreen,
      navigationOptions:{
        tabBarLabel:'Home',
        tabBarIcon:() => (
          <Icon name="home" size={22}/>
        )
      }
    },
    Discover: {
      screen:Discover,
      navigationOptions:{
        tabBarLabel:'Discover',
        tabBarIcon:() => (
          <Icon name="md-compass" type='ionicon' size={22}/>
        )
      }
    }
  });

//More about navigation https://reactnavigation.org/docs/en/auth-flow.html
//createStackNavigator is a function that takes a route configuration object and an options object and returns a React component.
const AppStack = createStackNavigator(
  { 
    UserLibrary: {
      screen: TabNavigator,
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
  });
const AuthStack = createStackNavigator({ SignIn: LogInOptionsScreen, Register: CreateAccount });

export default createAppContainer(
  createSwitchNavigator(
  {
    Start: StartScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'Start',
  })
);
