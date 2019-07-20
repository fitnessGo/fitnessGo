import React from "react";
import { View, StyleSheet, Text, TextInput, Picker } from "react-native";
import { Button, Icon } from "react-native-elements";
import Card from "../components/Card";
import { FontStyles } from "../styles/global";
import SetDetailsView from "../screens/SetDetailsView";
import SetCard from "../components/SetCard";
import getStyleSheet from "../styles/themestyles";

class ExerciseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
      description: "",
      exerciseSets: [this.props.exercise.exerciseSets[0]],
      custom: false
    };

    this.customName = "";
    this.addSet = this.addSet.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeDesc = this.changeDesc.bind(this);
    this.updateSet = this.updateSet.bind(this);
  }

  addSet() {
    let sets = this.props.exercise.exerciseSets;

    let set = {
      id: sets.length,
      repetitions: 0,
      duration: 0,
      break: 0,
      weight: 0
    };

    sets.push(set);
    this.props.onSetsChange(sets, this.props.id);
  }

  changeName(newName) {
    let id = this.props.id;
    this.props.onNameChange(newName, id);
  }

  changeDesc(newDesc) {
    let id = this.props.id;
    this.props.onDescChange(newDesc, id);
  }

  deleteSet(id) {
    let sets = this.props.exercise.exerciseSets;
    sets = sets.filter(set => set.id !== id);
    sets.forEach((set, id) => {
      set.id = id;
    });
    this.props.onSetsChange(sets, this.props.id);
  }

  updateSet(id, newSet) {
    let sets = this.props.exercise.exerciseSets;
    sets[id] = newSet;
    this.setState(
      {
        exerciseSets: sets
      },
      () => {
        this.props.onSetsChange(this.state.exerciseSets, this.props.id);
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.exerciseSets !== this.props.exercise.exerciseSets &&
      this.props.exercise.exerciseSets !== prevProps.exercise.exerciseSets
    ) {
      this.setState({ exerciseSets: this.props.exercise.exerciseSets });
    }
    if (this.props.predefinedExercises != prevProps.predefinedExercises) {
      this.changeName(this.props.predefinedExercises[0].name);
      this.changeDesc(this.props.predefinedExercises[0].description);
    }

    let predefinedNames = [];
    this.props.predefinedExercises.map(exercise => {
      predefinedNames.push(exercise.name);
    });

    if (
      this.props.exercise.name !== prevProps.exercise.name &&
      this.props.exercise.name !== "Custom"
    ) {
      if (predefinedNames.includes(this.props.exercise.name)) {
        this.setState({ custom: false, name: this.props.exercise.name });
      } else {
        this.setState({ custom: true, name: "Custom" });
      }
      // console.warn('true');
    }
  }

  render() {
    const exerciseViewStyle = this.props.darkTheme
      ? exerciseViewStyles.exersiseViewDark
      : exerciseViewStyles.exersiseViewLight;
    const iconColor = this.props.darkTheme ? "#FFFFFF" : "#D1D1D6";
    const theme = getStyleSheet(this.props.darkTheme);

    return (
      <View style={this.props.style}>
        <Card style={exerciseViewStyle}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Picker
              selectedValue={this.state.name}
              style={{
                height: 40,
                minWidth: "85%",
                alignSelf: "flex-start"
              }}
              itemStyle={{
                height: 41,
                ...FontStyles.h1,
                ...FontStyles.bold,
                ...theme.text,
                fontWeight: "bold",
                textAlign: "left"
              }}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue === "Custom") {
                  this.setState({ custom: true, name: itemValue });
                  this.changeName("");
                } else {
                  this.changeName(itemValue);
                  this.setState({ custom: false, name: itemValue });
                }

                this.props.predefinedExercises.forEach(exercise => {
                  if (exercise.name === itemValue) {
                    if (exercise.description) {
                      this.changeDesc(exercise.description);
                    } else {
                      this.changeDesc("");
                    }
                  }
                });
              }}
            >
              {this.props.predefinedExercises.map((exercise, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={exercise.name}
                    value={exercise.name}
                  />
                );
              })}
            </Picker>
            {this.props.deletable >= 1 && (
              <Icon
                name="close"
                type="material-community"
                size={22}
                color={iconColor}
                onPress={() => {
                  this.props.onDeletePress();
                  this.setState({ name: this.props.exercise.name });
                }}
              />
            )}
          </View>
          {this.state.custom && (
            <TextInput
              style={[{ ...FontStyles.h1, ...FontStyles.bold }, theme.text]}
              placeholder="Exercise name"
              onChangeText={this.changeName}
              underlineColorAndroid="transparent"
            >
              {this.props.exercise.name !== "Custom" &&
                this.props.exercise.name}
            </TextInput>
          )}
          <TextInput
            style={theme.text}
            placeholder="Description"
            onChangeText={this.changeDesc}
            underlineColorAndroid="transparent"
          >
            {this.props.exercise.description}
          </TextInput>
          <View style={{ marginTop: 10 }}>
            {this.props.exercise.exerciseSets.map((es, index) => {
              return (
                <View key={index}>
                  <SetCard
                    set={es}
                    id={index}
                    deletable={
                      this.props.exercise.exerciseSets.length > 1 ? true : false
                    }
                    value={es}
                    onChange={this.updateSet}
                    darkTheme={this.props.darkTheme}
                    onDeletePress={() => this.deleteSet(index)}
                  />
                </View>
              );
            })}
          </View>
          <Button
            type="clear"
            title="Add set"
            titleStyle={theme.text}
            style={{ flexDirection: "row", alignSelf: "flex-end" }}
            onPress={this.addSet}
          />
        </Card>
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
  }
});

export default ExerciseCard;
