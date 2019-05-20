import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class CreateAccount extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>CreateAccount</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#bcc2ff',
    },
});

export default CreateAccount;
