import React from "react";
import { View } from "react-native";
import { Card, Text, Button, Input, Icon } from 'react-native-elements'


class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  onSignInClick() {
    this.props.navigation.navigate('App');
  }
  createAccountButtonPressed() {
    this.props.navigation.navigate('Register');
  }
  render() {
    return (
      //FIXME: Use this card view form for sign in, though here we want to show Gacebook/Google/Email login, and if the user clicked email then we show this form
      <View>
        <View style={{ paddingVertical: 20 }}>
          <Card title="SIGN IN">
            <Input
              placeholder="Email address"
              keyboardType='email-address'
              leftIcon={
                <Icon
                  name='email'
                  color='black'
                />
              }
            />
            <Input
              placeholder="Password"
              secureTextEntry={true}
              returnKeyType="go"
              rightIcon={
                <Icon
                  name='email'
                />
              }
            />
            
            <Button
              buttonStyle={{ marginTop: 20 }}
              backgroundColor="#03A9F4"
              title="SIGN IN"
              onPress={() => this.onSignInClick()}
            />
          </Card>
        </View>

        {/* TODO: Add Facebook login button*/}
        {/* TODO: Add Google login button*/}
        <View>
          <Button type="clear" title="Create account" onPress={ () =>  this.createAccountButtonPressed()} />
        </View>
      </View>
    );
  }

}

export default SignInScreen;
