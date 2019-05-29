import React, { Component } from 'react';
import {
    StyleSheet,
    Button,
    View,
    Alert
} from 'react-native';

//FIXME: The route of this screen will be set after settings screen is made
export default class DeleteAccountScreen extends Component {
    static navigationOptions = {
        title: 'Settings',
      };

      //On clicking the Delete Account Button a confirmation box will apear which will ask the user
      //to cconfirm if they want to delete their account from the system
      onDeleteAccountButtonClick() {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete your account?',
            [
                //FIXME: On pressing delete the delete account functionality should be implemented
              {text: 'Delete', onPress: () => console.warn('Delete Pressed')},
              {text: 'No', onPress: () => console.warn('No Pressed'), style: 'cancel'},
            ]
          );
      }
    
    render() {
        return (
            <View style={styles.container}>
                <Button
                    buttonStyle={styles.button}
                    title="Delete Account"
                    onPress={() => {
                        this.onDeleteAccountButtonClick();
                    }}
                ></Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 20 
    }
});
