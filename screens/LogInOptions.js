import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button, Image, Icon } from "react-native-elements";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import { handleFbLogin, handleGoogleLogin } from "../lib/auth";
import Logo from '../logo.png';

class LogInScreen extends React.Component {
  static navigationOptions = {
    title: "Log in"
  };

  toString(err) {
    return err + "";
  }
  onLogInWithFaceBookClick() {
    handleFbLogin()
      .then(err => {
        if (!err) {
          this.props.navigation.navigate("App");
        }
      })
      .catch(err => {
        var str = JSON.stringify(err);
        if (str.includes("CONNECTION_FAILURE")) {
          alert( "Unable to Sign you in. Please check your internet connection!");
        }
        else {
          alert("There was a problem in signing you in. Please try again.");
        }
      });
  }

  onLogInWithGoogleClick() {
     handleGoogleLogin()
      .then(err => {
        if (!err) {
          this.props.navigation.navigate("App");
        }
      })
      .catch(err => {
        if (this.toString(err) == "Error: NETWORK_ERROR") {
          alert( "Unable to Sign you in. Please check your internet connection!");
        }
        else {
          alert("There was a problem in signing you in. Please try again.");
        }
      });
  }

  //I have kept it SignIn for now
  onLogInWithEmailClick() {
    this.props.navigation.navigate("SignIn");
  }

  onSignUpClick() {
    this.props.navigation.navigate("Register");
  }

  render() {
    return (
      <View style={{ backgroundColor: "#3c1a5b", height: "100%" }}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.image}
            source={Logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.container}>
          <Button
            buttonStyle={[styles.button, { backgroundColor: "#3C5A99" }]}
            icon={<Icon name="logo-facebook" type="ionicon" size={35} color="white" containerStyle={{ marginLeft: -90, marginRight: 20 }} />}

            title="Log in with Facebook"
            onPress={() => this.onLogInWithFaceBookClick()}
          />

          <GoogleSigninButton
            style={styles.button}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={() => this.onLogInWithGoogleClick()}
          />

          {/* <Button
              buttonStyle={styles.button}
              title="Log in with email"
              onPress={() => this.onLogInWithEmailClick()}
          />

          <Button
              buttonStyle={styles.button}
              title="Sign up"
              onPress={() => this.onSignUpClick()}
          /> */}
        </View>
        {/* <View>
              <Button type="clear" title="Forgot Password" />
          </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    marginTop: 50,
  },
  button: {
    height: 55,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
  },
  container: {
    paddingVertical: 20
  }
});

export default LogInScreen;
