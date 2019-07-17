import React, { Component } from "react";
import { StyleSheet, Button, View, Alert, SafeAreaView, Switch, Text } from "react-native";
import { ScreenStyles } from "../styles/global";
import getStyleSheet from "../styles/themestyles";
import { handleFbLogin, handleLogout } from "../lib/auth";
import firebase from 'react-native-firebase';
import { ListItem, Icon } from 'react-native-elements';

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
        <View>
          <ListItem
            title='Delete Account'
            leftIcon={{ name: 'delete', color: iconStyle, size: 22, paddingLeft: '7%', }}
            containerStyle={theme.background}
            titleStyle={textStyle}
            onPress={this.deleteAccount}
          />

          <ListItem
            title='Log Out'
            leftIcon={{ name: 'md-log-out', type: 'ionicon', color: iconStyle, size: 22, paddingLeft: '9%' }}
            containerStyle={theme.background}
            titleStyle={textStyle}
            onPress={this.logout}
          />
           <ListItem
            leftIcon={ <Switch
                  onValueChange={this.toggleDarkTheme}
                  value={this.state.darkTheme} 
                  style={{ transform: [{ scaleX:  .9  }, { scaleY:  .9  }] }}/> }
            title='Dark theme'
            containerStyle={theme.background}
            titleStyle={textStyle}
            onPress={this.toggleDarkTheme}
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
    fontSize: 16
  },
  textDark: {
    color: '#ffffff',
    fontSize: 16
  },
  iconLight: {
    color: '#000000'
  },
  iconDark: {
    color: '#ffffff',
  }
});
