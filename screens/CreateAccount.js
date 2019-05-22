import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button, Input } from 'react-native-elements'

class CreateAccount extends Component {
    render() {
        return (
            <View style={styles.container}>
            <Card title="Create new account" containerStyle={styles.card}>
            <Input
            placeholder="Email address"
            keyboardType='email-address'
            />
            <Input
            placeholder="Password"
            secureTextEntry={true}
            returnKeyType="next"
            style={styles.textStyle}
            />
            
            <Input
            placeholder="Repeat password"
            secureTextEntry={true}
            returnKeyType="go"
            placeholderTextColor='#aaaaaa'
            />
            
            <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="Submit"
            onPress={() => this.onSignInClick()}
            />
            </Card>
            </View>
            );
        }
    }
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            // justifyContent: 'center',
            // alignItems: 'center',
            backgroundColor: '#bcc2ff',
            paddingVertical: 20
        },
        card: {
            borderColor: 'rgba(255, 255, 255, 0.0)',
            borderRadius: 10,
            // backgroundColor: 'rgb(240, 190, 255)',
            // borderWidth: 0,
            shadowOffset:{  width: 0,  height: 0,  },
            shadowColor: 'black',
            shadowRadius: 12,
            shadowOpacity: 0.2
        },
        textStyle: {
            color: '#ff0088',
            backgroundColor: 'red'
        }
    });
    
    export default CreateAccount;
