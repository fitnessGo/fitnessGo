import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button, Input } from 'react-native-elements'

class CreateAccount extends Component {
    constructor(props) {
        super(props);
        
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
    }
    //to jump to the next field when the user 
    focusNextField(id) {
        this.inputs[id].focus();
    }
    onSignInClick() {
        this.props.navigation.navigate('App');
      }
    render() {
        return (
            <View style={styles.container}>
            <Card title="Create new account" containerStyle={styles.card}>
            <Input
            placeholder="Email address"
            keyboardType='email-address'
            returnKeyType={"next"}
            onSubmitEditing={() => {
                this.focusNextField('password1');
            }}
            ref={ input => {
                this.inputs['email'] = input;
            }}
            />
            <Input 
            placeholder="Password"
            secureTextEntry={true}
            returnKeyType="next"
            style={styles.textStyle}
            blurOnSubmit={ false }
            onSubmitEditing={() => {
                this.focusNextField('password2');
            }}
            ref={ input => {
                this.inputs['password1'] = input;
            }}
            />
            
            <Input
            placeholder="Repeat password"
            secureTextEntry={true}
            returnKeyType="done"
            placeholderTextColor='#cccccc'
            ref={ input => {
                this.inputs['password2'] = input;
            }}
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
