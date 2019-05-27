import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

class StartScreen extends React.Component {
    constructor() {
        super();
        this.unsubscriber = null;
        this.state = {
          user: null,
        };
      }
    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            this.setState({ user });
            this.props.navigation.navigate(user ? 'App' : 'Auth');
        });
    }
    componentWillUnmount() {
        if (this.unsubscriber) {
          this.unsubscriber();
        }
      }
    
    render() {
        return (
            <View style={styles.container}>               
                <View>
                    <Text style={{flexDirection:'row', flexWrap:'wrap'}}>
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
