import React, {Component} from 'react';
import { StyleSheet,
        Text,
        View,
        TouchableOpacity, 
        Modal} from 'react-native';

export default class Login extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.buttonContainer} 
                     onPress={onButtonPress}>
                    <Text  style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
                <Modal animationType = {"slide"} transparent = {false}
               visible = {this.state.modalVisible}
               onRequestClose = {() => { console.log("Modal has been closed.") } }>
               
                <View style = {styles.modal}>
                    <Text style = {styles.text}>Are you sure you want to delete your account</Text>
                    
                    <TouchableHighlight onPress = {() => {
                        }}>
                        
                        <Text style = {styles.text}>Delete</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress = {() => {
                        }}>
                        
                        <Text style = {styles.text}>No</Text>
                    </TouchableHighlight>
                </View>
                </Modal>
            </View>
        );
    }
}  

const styles = StyleSheet.create({
    container: {
     padding: 20
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f7021a',
        padding: 100
     },
     text: {
        color: '#3f2949',
        marginTop: 10
     }
});
