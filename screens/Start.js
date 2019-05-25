import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';


class StartScreen extends React.Component {
    _isSignedIn() {
        return new Promise((resolve, reject) => {
            //Example: Backend logic can be here
            //FIXME: this setTimeout is for demonstration only. should be replaced with real approach
            setTimeout(() => {
                const rand = Math.floor(Math.random() * 2);
                var signedIn = (rand == 1) ? true : false;
                resolve(signedIn);
              }, 1000);
            //reject(err);
          });
      }
    componentDidMount() {
        //Here we perform a check if the user is signed in.
        //If yes, we redirect to the home screen
        //If no, we redirect to login page.
        this._isSignedIn()
        .then(res => { 
            this.props.navigation.navigate(res ? 'App' : 'Auth');
        })
        .catch(err => alert("An error occurred"));
      }
       

    render() {
        return (
            <View style={styles.container}>
                <Text>Start Screen</Text>
                <Text>Checking if user is signed in...</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9efff9'
    },
});

export default StartScreen;
