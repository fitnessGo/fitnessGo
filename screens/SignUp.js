import React from "react";
import { View } from "react-native";
import { Card, Button, Input, Text } from "react-native-elements";

class SignUpScreen extends React.Component {
  static navigationOptions = {
    title: 'Create account',
  };

  render() {
    return (
      <View >
        <Text>Sign Up Screen</Text>
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}

export default SignUpScreen;
