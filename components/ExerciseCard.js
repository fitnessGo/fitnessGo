import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { Button, Icon } from "react-native-elements";
import WorkoutCard from "../components/WorkoutCard";
import { FontStyles } from "../styles/global";
import SetDetailsView from "../screens/SetDetailsView";

class ExerciseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
      description: "",
      exerciseSets: [
      ]
    };

    this.addSet = this.addSet.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeDesc = this.changeDesc.bind(this);
  }

  addSet() {
      let set ={
        id: 0,
        duration: 0,
        repetitions: 0,
        weight: 0,
        notes: "",
        break: 0
      };

      let sets = this.state.exerciseSets;
      sets.push(set);

      this.setState({
          exerciseSets: sets
      });
  }

  changeName(newName) {
    let id = this.props.id;
    this.props.onNameChange(newName, id);
  }

  changeDesc(newDesc) {
    let id = this.props.id;
    this.props.onDescChange(newDesc, id);
  }

  render() {
    const exerciseViewStyle =
      this.props.darkTheme || false
        ? exerciseViewStyles.exersiseViewDark
        : exerciseViewStyles.exersiseViewLight;
    const exerciseViewTextStyle =
      this.props.darkTheme || false
        ? exerciseViewStyles.exersiseViewTextDark
        : exerciseViewStyles.exersiseViewTextLight;

    return (
      <View style={this.props.style}>
        <WorkoutCard style={exerciseViewStyle}>
          <TextInput
            style={[
              exerciseViewTextStyle,
              { ...FontStyles.h1, ...FontStyles.bold }
            ]}
            placeholder="Exercise name"
            onChangeText={this.changeName}
            underlineColorAndroid="transparent"
          >
            {this.props.exercise.name}
          </TextInput>
          <TextInput
            style={exerciseViewTextStyle}
            placeholder="Description"
            onChangeText={this.changeDesc}
            underlineColorAndroid="transparent"
          >
            {this.props.exercise.description}
          </TextInput>
          <View style={{ marginTop: 10 }}>
            {this.state.exerciseSets.map((es, index) => {
              return (
                <View key={index}>
                  <Text style={exerciseViewTextStyle}>Set {index + 1}</Text>
                  <SetDetailsView set={es} darkTheme={this.props.darkTheme} />
                </View>
              );
            })}
          </View>
          <Button
                type="clear"
                title="Add set"
                style={{ flexDirection: "row", alignSelf: "flex-end" }}
                onPress={this.addSet} />
        </WorkoutCard>
      </View>
    );
  }
}

const exerciseViewStyles = StyleSheet.create({
  exersiseViewLight: {
    padding: 6,
    backgroundColor: "#ffffff"
  },
  exersiseViewDark: {
    padding: 6,
    backgroundColor: "#4f4f4f"
  },
  exersiseViewTextLight: {
    color: "#000000",
    fontSize: 16
  },
  exersiseViewTextDark: {
    color: "#ffffff",
    fontSize: 16
  }
});

export default ExerciseCard;
