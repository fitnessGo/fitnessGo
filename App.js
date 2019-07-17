
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import AppContainer from "./components/homeRouter";
import FlashMessage from "react-native-flash-message";
import { MenuProvider } from "react-native-popup-menu";

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <MenuProvider>
        <View style={{ flex: 1 }}>
          <AppContainer />
          <FlashMessage position="top" />
        </View>
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
