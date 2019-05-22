import React from "react";
import { View } from "react-native";
import { Card, Button, Input, Text } from "react-native-elements";

class SignUpScreen extends React.Component {
  static navigationOptions = {
    title: 'Create account',
  };

  render() {
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card title="SIGN UP">
          <FormLabel>Email</FormLabel>
          <FormInput placeholder="Email address..." />
          <FormLabel>Password</FormLabel>
          <FormInput secureTextEntry placeholder="Password..." />

          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="Create account"
          // onPress={() => onSignIn()}
          />
        </Card>
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}

export default SignUpScreen;
