import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


class StartScreen extends React.Component {
    _isSignedIn() {
        return new Promise((resolve, reject) => {
            //TODO: Backend logic can be here
            resolve(false);
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
                <View>
                    <Text style={{flexDirection:'row', flexWrap:'wrap'}}>
                        Checking if signed in...
                    </Text>
                </View>
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
