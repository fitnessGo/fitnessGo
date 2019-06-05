import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

//Import screens
import SignInScreen from "../screens/SignIn";
import CreateAccount from "../screens/CreateAccount";
import StartScreen from "../screens/Start";
import HomeScreen from "../screens/Home"
import DeleteAccountScreen from "../screens/DeleteAccount";
//More about navigation https://reactnavigation.org/docs/en/auth-flow.html
//createStackNavigator is a function that takes a route configuration object and an options object and returns a React component.
const AppStack = createStackNavigator(
  { 
    UserLibrary: {
      screen: HomeScreen,
      navigationOptions: {
        title: "Home"
      }
    }
  });
const AuthStack = createStackNavigator({ SignIn: SignInScreen, Register: CreateAccount, Home: HomeScreen, DeleteAccount: DeleteAccountScreen });

export default createAppContainer(
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
