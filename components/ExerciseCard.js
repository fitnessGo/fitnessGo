import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { Button, Icon } from "react-native-elements";
import WorkoutCard from "../components/WorkoutCard";
import { FontStyles } from "../styles/global";
import SetDetailsView from "../screens/SetDetailsView";
import SetCard from "../components/SetCard";

class ExerciseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
      description: "",
      exerciseSets: []
    };

    this.addSet = this.addSet.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeDesc = this.changeDesc.bind(this);
    this.updateSet = this.updateSet.bind(this);
  }

  addSet() {
    let sets = this.state.exerciseSets;

    let set = {
      id: sets.length,
      repetitions: 0,
      duration: 0,
      break: 0,
      weight: 0
    };

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

  deleteSet(id) {
    let sets = this.state.exerciseSets;
    sets = sets.filter(set => set.id !== id);
    sets.forEach((set, id) => {
      set.id = id;
    });
    this.setState({ exerciseSets: sets });
  }

  updateSet(id, newSet) {
    let sets = this.state.exerciseSets;
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
    const iconColor = this.props.darkTheme || false ? "#ff453a" : "#ff3b30";

    return (
      <View style={this.props.style}>
        <WorkoutCard style={exerciseViewStyle}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
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
            <Icon
              name="close"
              type="material-community"
              size={22}
              color={iconColor}
              onPress={this.props.onDeletePress}
            />
          </View>
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
                  <SetCard
                    set={es}
                    id={index}
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
            style={{ flexDirection: "row", alignSelf: "flex-end" }}
            onPress={this.addSet}
          />
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
  }
});

export default ExerciseCard;
