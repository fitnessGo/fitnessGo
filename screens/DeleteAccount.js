import React, { Component } from 'react';
import {
    StyleSheet,
    Button,
    View,
    Modal, 
    Text,
    TouchableHighlight,
    Alert
} from 'react-native';

export default class DeleteAccountScreen extends Component {
    state = {
        modalVisible: false,
      };
    
      setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }
    
    render() {
        return (
            <View style={styles.container}>
                <Button
                    buttonStyle={styles.button}
                    title="Delete Account"
                    onPress={() => {
                        this.setModalVisible(true);
                    }}
                ></Button>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}>
          <View style={{marginTop: 22}}>
            <View>

              <Button
              title="delete"
                onPress={() => {
                    this.setModalVisible(true);
                }}>
              </Button>
            </View>
          </View>
        </Modal>
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
    },
    modal: {
        alignItems: 'center',
        backgroundColor: '#f7021a',
        padding: 100
    },
    text: {
        color: '#3f2949',
        marginTop: 10
    }
});
