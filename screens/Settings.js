import React, { Component } from "react";
import { StyleSheet, Button, View, Alert, SafeAreaView } from "react-native";
import { FontStyles, ScreenStyles } from "../styles/global";
import getStyleSheet from "../styles/themestyles";
import { handleFbLogin, handleLogout } from "../lib/auth";
import firebase from 'react-native-firebase';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkTheme: false,
      dataReady: true
    };
    this.deleteAccount = this.deleteAccount.bind(this);
    this.logout = this.logout.bind(this);
  }

  static navigationOptions = {
    title: "Settings"
  };

  deleteAccount() {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete your account?",
      [
        { text: "Delete", onPress: () => {
          firebase.auth().currentUser.delete().then(() => {
            handleLogout();
          }).then(() => {
            alert("Your account was deleted 😔");
            this.props.navigation.navigate("Auth");
          }).catch((err) => {
            console.warn(err);
            alert("Couldn't delete the account. Check your internet connection.")
          });
        }, style: "destructive" },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  }

  logout() {
    handleLogout().then(() => {
      firebase.auth().signOut();
      this.props.navigation.navigate("Auth");
    })
    .catch(err => {
      alert("Couldn't log out. Try again later 🙁");
    });
  }

  render() {
    const theme = getStyleSheet(this.state.darkTheme);
    const workoutViewStyle = this.state.darkTheme
      ? styles.workoutViewDark
      : styles.workoutViewLight;
    return (
      <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
        <View style={styles.container}>
          <Button
            style={styles.button}
            title="Delete Account"
            color="red"
            onPress={this.deleteAccount}
          />
          <Button style={styles.button} title="Logout" onPress={this.logout} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    marginTop: "15%"
  }
});
