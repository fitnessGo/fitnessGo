import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button, Image } from "react-native-elements";
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { handleFbLogin, handleGoogleLogin } from "../lib/auth";

class LogInScreen extends React.Component {
  static navigationOptions = {
    title: "Log in"
  };
  
  onLogInWithFaceBookClick() {
    handleFbLogin()
      .then(err => {
        if (!err) {
          this.props.navigation.navigate("App");
        }
      })
      .catch(err => {
        alert("Couldn't authenticate your Facebook account 🙁");
      });
  }

  onLogInWithGoogleClick() {
    handleGoogleLogin().then((err) => {
      if(!err){
        this.props.navigation.navigate("App");
      }
    })
    .catch(err => {
      alert("Couldn't authenticate your Google account 🙁");
    })
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
      <View>
        <View>
          <Image
            style={styles.image}
            source={{
              uri:
                "https://media.defense.gov/2010/Sep/03/2000329023/-1/-1/0/100419-F-8716G-102.JPG"
            }}
          />
        </View>
        <View style={styles.container}>
          <Button
            buttonStyle={styles.button}
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
    width: 200,
    height: 200,
    marginTop: 50,
    marginLeft: 80,
    marginRight: 60
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
