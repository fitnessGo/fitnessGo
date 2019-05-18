//import liraries
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

//Import screens
import SignUpScreen from "../screens/SignUp";
import SignInScreen from "../screens/SignIn";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import StartScreen from "../screens/Start";
import HomeScreen from "../screens/Home"

//createStackNavigator is a function that takes a route configuration object and an options object and returns a React component.
const AppStack = createStackNavigator({ Home: HomeScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen, SignUp: SignUpScreen, Register: CreateAccountScreen });


export default createAppContainer(
  /*
    The purpose of SwitchNavigator is to only ever show one screen at a time. 
    By default, it does not handle back actions and it resets routes to their default state when you switch away. 
    This is the exact behavior that we want from the authentication flow: 
    when users sign in, we want to throw away the state of the authentication flow and unmount all of the screens, 
    and when we press the hardware back button we expect to not be able to go back to the authentication flow. 
    We switch between routes in the SwitchNavigator by using the navigate action.
  */
  createSwitchNavigator(
  {
    Start: StartScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Start',
  })
);
