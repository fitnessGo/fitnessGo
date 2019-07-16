import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Card from '../components/Card';
import { FontStyles, ScreenStyles } from '../styles/global';


class SetDetailsView extends React.Component {
    render() {
        const setViewStyle = this.props.darkTheme || false ? setViewStyles.exersiseSetViewDark : setViewStyles.exersiseSetViewLight
        const setViewTextStyle = this.props.darkTheme || false ? setViewStyles.exersiseSetViewTextDark : setViewStyles.exersiseSetViewTextLight
        return (
            <View>
                <Card style={setViewStyle}>
                    <Text style={setViewTextStyle}>Repetitions <Text style={FontStyles.bold}>{this.props.set.repetitions}</Text></Text>
                    <Text style={setViewTextStyle}>Duration <Text style={FontStyles.bold}>{this.props.set.duration}</Text> sec</Text>
                    <Text style={setViewTextStyle}>Break {this.props.set.break || 0} sec</Text>
                </Card>
            </View>
        )
    }
}
const setViewStyles = StyleSheet.create({
    exersiseSetViewLight: {
        width: "95%",
        backgroundColor: '#fafafa',
        alignSelf: 'center',
        padding: 6,
        shadowOpacity: null,
        shadowRadius: null,
        borderWidth: 0.2,
        borderColor: '#cccccc',
        marginTop: 10,
        marginBottom: 10,
        elevation: 0
    },
    exersiseSetViewDark: {
        width: "95%",
        backgroundColor: '#8f8f8f',
        alignSelf: 'center',
        padding: 6,
        shadowOpacity: null,
        shadowRadius: null,
        borderWidth: 0.2,
        borderColor: '#cccccc',
        marginTop: 10,
        marginBottom: 10,
        elevation: 0
    },
    exersiseSetViewTextLight: {
        color: '#000000'
    },
    exersiseSetViewTextDark: {
        color: '#ffffff'
    }
});
export default SetDetailsView;