import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import WorkoutCard from '../components/WorkoutCard';
import { FontStyles, ScreenStyles } from '../styles/global';


class SetDetailsView extends React.Component {
    render() {
        const setViewStyle = this.props.darkTheme || false ? setViewStyles.exersiseSetViewDark : setViewStyles.exersiseSetViewLight
        const setViewTextStyle = this.props.darkTheme || false ? setViewStyles.exersiseSetViewTextDark : setViewStyles.exersiseSetViewTextLight
        return (
            <View>
                <WorkoutCard style={setViewStyle}>
                    <Text style={setViewTextStyle}>Repetitions <Text style={FontStyles.bold}>{this.props.set.repetitions}</Text></Text>
                    <Text style={setViewTextStyle}>Duration <Text style={FontStyles.bold}>{this.props.set.duration}</Text> sec</Text>
                    <Text style={setViewTextStyle}>Break {this.props.set.break || 0} sec</Text>
                </WorkoutCard>
            </View>
        )
    }
}
const setViewStyles = StyleSheet.create({
    exersiseSetViewLight: {
        width: "95%",
        backgroundColor: '#fefefe',
        alignSelf: 'center',
        padding: 6,
        color: '#ffffff',
        marginTop: 10,
        marginBottom: 10
    },
    exersiseSetViewDark: {
        width: "95%",
        backgroundColor: '#5f5f5f',
        alignSelf: 'center',
        padding: 6,
        marginTop: 10,
        marginBottom: 10
    },
    exersiseSetViewTextLight: {
        color: '#000000'
    },
    exersiseSetViewTextDark: {
        color: '#ffffff'
    }
});
export default SetDetailsView;