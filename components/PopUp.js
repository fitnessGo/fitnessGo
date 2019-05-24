import React, { Component } from "react";
import { View, Button, Text, StyleSheet } from "react-native";

class PopUp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button title="Add" style={styles.button} />
        <Button title="Delete" style={styles.button} color="#FF3B30" />
        <Button title="Edit" style={styles.button} />
        <Button title="Share" style={styles.button} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 12,
    height: 150,
    marginTop: -5,
    position: 'absolute',
    width: "70%",
    zIndex: 10
  }
});

export default PopUp;
