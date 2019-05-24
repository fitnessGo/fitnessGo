import React, { Component } from "react";
import DiscoverItem from "../components/DiscoverItem";
import WorkoutCard from "../components/WorkoutCard";
import { ScrollView, Text, StyleSheet } from "react-native";

class Discover extends Component {
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator="false"
      >
        <WorkoutCard>
          <DiscoverItem
            workout={{
              name: "Workout 1",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
        </WorkoutCard>
        <WorkoutCard>
          <DiscoverItem
            workout={{
              name: "Workout 2",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
        </WorkoutCard>
        <WorkoutCard>
          <DiscoverItem
            workout={{
              name: "Workout 3",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
        </WorkoutCard>
        <WorkoutCard>
          <DiscoverItem
            workout={{
              name: "Workout 4",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
        </WorkoutCard>
        <WorkoutCard>
          <DiscoverItem
            workout={{
              name: "Workout 5",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
        </WorkoutCard>
        <WorkoutCard>
          <DiscoverItem
            workout={{
              name: "Workout 6",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
        </WorkoutCard>
        <WorkoutCard>
          <DiscoverItem
            workout={{
              name: "Workout 7",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
        </WorkoutCard>
        <WorkoutCard>
          <DiscoverItem
            workout={{
              name: "Workout 8",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
        </WorkoutCard>
        <WorkoutCard>
          <DiscoverItem
            workout={{
              name: "Workout 9",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
        </WorkoutCard>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: 40
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

export default Discover;
