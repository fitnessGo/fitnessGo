import React, { Component } from "react";
import { StyleSheet, Button, View, Alert, SafeAreaView, Switch, Text, TouchableOpacity } from "react-native";
import { ScreenStyles } from "../styles/global";
import getStyleSheet from "../styles/themestyles";
import { handleFbLogin, handleLogout } from "../lib/auth";
import firebase from 'react-native-firebase';
import { ListItem } from 'react-native-elements';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkTheme: window.darkTheme,
      dataReady: true
    };
    this.deleteAccount = this.deleteAccount.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleDarkTheme = this.toggleDarkTheme.bind(this);
  }

  static navigationOptions = {
    title: "Settings"
  };

  deleteAccount() {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Delete", onPress: () => {
            firebase.auth().currentUser.delete().then(() => {
              handleLogout();
            }).then(() => {
              alert("Your account was deleted 😔");
              this.props.navigation.navigate("Auth");
            }).catch((err) => {
              console.warn(err);
              alert("Couldn't delete the account. Check your internet connection.")
            });
          }, style: "destructive"
        },
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
  toggleDarkTheme() {
    window.darkTheme = !window.darkTheme;
    this.setState({ darkTheme: window.darkTheme });
  }

  render() {
    const theme = getStyleSheet(this.state.darkTheme);
    const textStyle = this.state.darkTheme ? styles.textDark : styles.textLight;
    const iconStyle = this.state.darkTheme ? styles.iconDark.color : styles.iconLight.color;

    return (
      <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]}>
        <View >
          {/* <Button
            style={styles.button}
            title="Delete Account"
            color="red"
            onPress={this.deleteAccount}
          />
          <Button style={styles.button} title="Logout" onPress={this.logout} />

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={textStyle}>Dark theme </Text>
            <Switch
              onValueChange={this.toggleDarkTheme}
              value={this.state.darkTheme} /></View> */}

          <TouchableOpacity onPress={this.deleteAccount}>
            <ListItem
              title='Delete Account'
              leftIcon={{ name: 'delete', color: iconStyle }}
              containerStyle={theme.background}
              titleStyle={textStyle}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.logout}>
            <ListItem
              title='Log Out'
              leftIcon={{ name: 'md-log-out', type: 'ionicon', color: iconStyle }}
              containerStyle={theme.background}
              titleStyle={textStyle}
            />
          </TouchableOpacity>

          <ListItem
            leftIcon={<Switch
              onValueChange={this.toggleDarkTheme}
              value={this.state.darkTheme} />}
            title='Dark theme'
            containerStyle={theme.background}
            titleStyle={textStyle}
          />
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
  },
  textLight: {
    color: '#000000',
    fontSize: 18,

  },
  textDark: {
    color: '#ffffff',
    fontSize: 18,
  },
  iconLight: {
    color: '#000000'
  },
  iconDark: {
    color: '#ffffff',
  }

});
