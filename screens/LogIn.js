import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button, Image } from 'react-native-elements'
import { handleFbLogin } from '../lib/auth';

class LogInScreen extends React.Component 
{
    static navigationOptions = {
        title: 'Log in',
    };
    //FIXME: this should redirect the user to login with Facebook page
    onLogInWithFaceBookClick() {
        handleFbLogin().then(()=> {
            this.props.navigation.navigate('App');
        });
    }

    //FIXME: this should redirect the user to login with Google page
    //I have kept it SignIn for now
    onLogInWithGoogleClick() {
        this.props.navigation.navigate('SignIn');
    }

    //I have kept it SignIn for now
    onLogInWithEmailClick() {
        this.props.navigation.navigate('SignIn');
    }

    onSignUpClick() {
        this.props.navigation.navigate('Register');
    }

    render() {
        return (
            <View>
                <View>
                    <Image
                        style={styles.image}
                        source={{ uri: 'https://media.defense.gov/2010/Sep/03/2000329023/-1/-1/0/100419-F-8716G-102.JPG' }}
                    />
                </View>
                <View style={styles.container}>
                    <Button
                        buttonStyle={styles.button}
                        title="Log in with FaceBook"
                        onPress={() => this.onLogInWithFaceBookClick()}
                    />

                    <Button
                        buttonStyle={styles.button}
                        title="Log in with Google"
                        onPress={() => this.onLogInWithGoogleClick()}
                    />

                    <Button
                        buttonStyle={styles.button}
                        title="Log in with email"
                        onPress={() => this.onLogInWithEmailClick()}
                    />

                    <Button
                        buttonStyle={styles.button}
                        title="Sign up"
                        onPress={() => this.onSignUpClick()}
                    />
                </View>
                <View>
                    <Button type="clear" title="Forgot Password" />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    image: { 
        width: 200, 
        height: 200, 
        marginTop: 50, 
        marginLeft: 80, 
        marginRight: 60 
    },
    button: { 
        marginTop: 20, 
        marginLeft: 20, 
        marginRight: 20 
    },
    container: { 
        paddingVertical: 20 
    }
  });

export default LogInScreen;
