import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Card from '../components/Card';
import { FontStyles } from '../styles/global';
import SetDetailsView from './SetDetailsView';

class ExerciseDetailsView extends React.Component {
    render() {
        const exerciseViewStyle = this.props.darkTheme || false ? exerciseViewStyles.exersiseViewDark : exerciseViewStyles.exersiseViewLight
        const exerciseViewTextStyle = this.props.darkTheme || false ? exerciseViewStyles.exersiseViewTextDark : exerciseViewStyles.exersiseViewTextLight
        return (
            <View style={this.props.style}>
                <Card style={exerciseViewStyle}>
                    <Text style={[exerciseViewTextStyle, { ...FontStyles.h1, ...FontStyles.bold }]}>{this.props.exercise.name}</Text>
                    <Text style={exerciseViewTextStyle}>{this.props.exercise.description}</Text>
                    <View style={{ marginTop: 10 }}>
                        {this.props.exercise.exerciseSets.map((es, index) => {
                            return (
                                <View key={index}>
                                    <Text style={exerciseViewTextStyle}>Set {index + 1}</Text>
                                    <SetDetailsView set={es} darkTheme={this.props.darkTheme} />
                                </View>
                            );
                        })
                        }
                    </View>
                </Card>
            </View>
        )
    }
}

const exerciseViewStyles = StyleSheet.create({
    exersiseViewLight: {
        padding: 6,
        backgroundColor: '#ffffff',
    },
    exersiseViewDark: {
        padding: 6,
        backgroundColor: '#4f4f4f',
    },
    exersiseViewTextLight: {
        color: '#000000',
        fontSize: 16,
    },
    exersiseViewTextDark: {
        color: '#ffffff',
        fontSize: 16
    }
});

export default ExerciseDetailsView;