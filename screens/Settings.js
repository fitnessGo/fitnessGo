import React, { Component } from "react";
import { StyleSheet, Button, View, Alert, SafeAreaView } from "react-native";
import { FontStyles, ScreenStyles } from "../styles/global";
import getStyleSheet from "../styles/themestyles";
import { handleFbLogin, handleLogout } from "../lib/auth";

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

  //On clicking the Delete Account Button a confirmation box will apear which will ask the user
  //to cconfirm if they want to delete their account from the system
  deleteAccount() {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete your account?",
      [
        //FIXME: On pressing delete the delete account functionality should be implemented
        { text: "Delete", onPress: () => console.warn("Delete Pressed") },
        {
          text: "Cancel",
          onPress: () => console.warn("Cancel Pressed"),
          style: "cancel"
        }
      ]
    );
  }

  logout() {
    handleLogout().then(() => {
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
