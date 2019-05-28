import React, { Component } from "react";
import DiscoverItem from "../components/DiscoverItem";
import { MenuProvider } from "react-native-popup-menu";
import { ScrollView, Text, StyleSheet } from "react-native";

class Discover extends Component {
  render() {
    return (
      <MenuProvider>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <DiscoverItem
            workout={{
              name: "Workout 1",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
          <DiscoverItem
            workout={{
              name: "Workout 2",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
          <DiscoverItem
            workout={{
              name: "Workout 3",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
          <DiscoverItem
            workout={{
              name: "Workout 4",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
          <DiscoverItem
            workout={{
              name: "Workout 5",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
          <DiscoverItem
            workout={{
              name: "Workout 6",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
          <DiscoverItem
            workout={{
              name: "Workout 7",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
          <DiscoverItem
            workout={{
              name: "Workout 8",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
          <DiscoverItem
            workout={{
              name: "Workout 9",
              category: "Cardio",
              count: 2,
              exercises: "Running, Cycling",
              time: "30:00"
            }}
          />
        </ScrollView>
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: "5%",
    marginRight: "5%"
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

export default Discover;
