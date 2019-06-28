import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import WorkoutCard from "../components/WorkoutCard";
import { FontStyles, ScreenStyles } from "../styles/global";

class SetCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      repetitions: 0,
      duration: 0,
      break: 0,
      weight: 0
    };

    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.setState({
      id: this.props.id
    });
  }

  async update(parameter, newValue) {
    newValue = Number(newValue);
    switch (parameter) {
      case "repetitions":
        await this.setState({ repetitions: newValue });
        break;
      case "break":
        await this.setState({ break: newValue });
        break;
      case "duration":
        await this.setState({ duration: newValue });
        break;
      default:
        break;
    }
    this.props.onChange(this.state.id, this.state);
  }

  render() {
    const setViewStyle =
      this.props.darkTheme || false
        ? setViewStyles.exersiseSetViewDark
        : setViewStyles.exersiseSetViewLight;
    const setViewTextStyle =
      this.props.darkTheme || false
        ? setViewStyles.exersiseSetViewTextDark
        : setViewStyles.exersiseSetViewTextLight;
    return (
      <View>
        <WorkoutCard style={setViewStyle}>
          <View style={setViewStyles.setCardRow}>
            <Text
              style={[
                setViewTextStyle,
                setViewStyles.setDetailName,
                FontStyles.h3
              ]}
            >
              Repetitions:{" "}
            </Text>
            <TextInput
              keyboardType="number-pad"
              style={[setViewStyles.setDetailValue, FontStyles.h3]}
              placeholder="0"
              
              onChangeText={reps => this.update("repetitions", reps)}
            />
          </View>
          <View style={setViewStyles.setCardRow}>
            <Text
              style={[
                setViewTextStyle,
                setViewStyles.setDetailName,
                FontStyles.h3
              ]}
            >
              Duration:{" "}
            </Text>
            <TextInput
              keyboardType="number-pad"
              style={[setViewStyles.setDetailValue, FontStyles.h3]}
              placeholder="0"
              onChangeText={duration => this.update("duration", duration)}
            />
            <Text style={FontStyles.h3}> sec</Text>
          </View>
          <View style={setViewStyles.setCardRow}>
            <Text
              style={[
                setViewTextStyle,
                setViewStyles.setDetailName,
                FontStyles.h3
              ]}
            >
              Break:{" "}
            </Text>
            <TextInput
              keyboardType="number-pad"
              style={[setViewStyles.setDetailValue, FontStyles.h3]}
              placeholder="0"
              onChangeText={newBreak => this.update("break", newBreak)}
            />
            <Text style={FontStyles.h3}> sec</Text>
          </View>
        </WorkoutCard>
      </View>
    );
  }
}
const setViewStyles = StyleSheet.create({
  exersiseSetViewLight: {
    width: "95%",
    backgroundColor: "#fafafa",
    alignSelf: "center",
    padding: 6,
    shadowOpacity: null,
    shadowRadius: null,
    borderWidth: 0.2,
    borderColor: "#cccccc",
    marginTop: 10,
    marginBottom: 10,
    elevation: 0
  },
  exersiseSetViewDark: {
    width: "95%",
    backgroundColor: "#8f8f8f",
    alignSelf: "center",
    padding: 6,
    shadowOpacity: null,
    shadowRadius: null,
    borderWidth: 0.2,
    borderColor: "#cccccc",
    marginTop: 10,
    marginBottom: 10,
    elevation: 0
  },
  exersiseSetViewTextLight: {
    color: "#000000"
  },
  exersiseSetViewTextDark: {
    color: "#ffffff"
  },
  setCardRow: {
    flexDirection: "row"
  },
  setDetailName: {
    width: "35%"
  },
  setDetailValue: {
    width: "10%"
  }
});

export default SetCard;
