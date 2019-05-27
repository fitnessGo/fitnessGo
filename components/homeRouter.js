import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

//Import screens
import SignInScreen from "../screens/SignIn";
import CreateAccount from "../screens/CreateAccount";
import StartScreen from "../screens/Start";
import HomeScreen from "../screens/Home";
import LogInScreen from "../screens/LogIn";

//More about navigation https://reactnavigation.org/docs/en/auth-flow.html
//createStackNavigator is a function that takes a route configuration object and an options object and returns a React component.
const AppStack = createStackNavigator({ Home: HomeScreen });
const AuthStack = createStackNavigator({ Login:LogInScreen, SignIn: SignInScreen, Register: CreateAccount });


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
