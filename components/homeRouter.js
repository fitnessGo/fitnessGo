import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

//Import screens
import LogInOptionsScreen from "../screens/LogInOptions";
import CreateAccount from "../screens/CreateAccount";
import StartScreen from "../screens/Start";
import HomeScreen from "../screens/Home"
import LogIn from '../screens/LogIn';
import WorkoutDetails from "../screens/WorkoutDetails"

//More about navigation https://reactnavigation.org/docs/en/auth-flow.html
//createStackNavigator is a function that takes a route configuration object and an options object and returns a React component.
const AppStack = createStackNavigator(
  { 
    UserLibrary: {
      screen: HomeScreen,
      navigationOptions: {
        title: "Home"
      }
    },
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
