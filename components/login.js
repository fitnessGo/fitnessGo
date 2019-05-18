import React, {Component} from 'react';
import { StyleSheet,
        Text,
        View,
        ImageBackground,
        TextInput,
        TouchableOpacity,
        Dimensions} from 'react-native';

export default class Login extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TextInput></TextInput>
                <TextInput ></TextInput>
                <TouchableOpacity style={styles.buttonContainer} 
                     onPress={onButtonPress}>
                    <Text  style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
            </View>
        );
    }
}  

const styles = StyleSheet.create({
    container: {
     padding: 20
    },
    input:{
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        padding: 10,
        color: '#fff'
    },
    buttonContainer:{
        backgroundColor: '#2980b6',
        paddingVertical: 15
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    }
});
