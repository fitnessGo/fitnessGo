import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontStyles } from '../../styles/global';
import { BreakTimer } from './Timer'
import WorkoutCard from '../../components/WorkoutCard';

export class TimerView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false,
            time: this.props.timer.time
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(null)
    }
    changeActiveState() {
        this.setState(previousState => (
            { active: !previousState.active }
        ))
    }
    render() {
        let timer = this.props.timer
        let timerStyle = { width: this.state.active ? "100%" : "95%" };
        if (timer instanceof BreakTimer) {
            timerStyle.backgroundColor = '#cfcfcf';
            return (
                <WorkoutCard style={[styles.container, this.props.style, timerStyle]}>
                    <View style={styles.leftSide}>
                        <Text style={FontStyles.default}>Break</Text>
                    </View>
                    <View style={styles.rightSide}>
                        <Text style={FontStyles.default}><Text style={{ ...FontStyles.h1, ...FontStyles.bold }}>{timer.time}</Text>sec</Text>
                    </View>
                </WorkoutCard>
            )
        }
        timerStyle.backgroundColor = '#fafafa';
        return (
            <WorkoutCard style={[styles.container, this.props.style, timerStyle]}>
                <View style={styles.leftSide}>
                    <Text style={FontStyles.default}>Exercise:  <Text style={{ ...FontStyles.bold }}>{timer.exerciseName}</Text></Text>
                    <Text style={FontStyles.default}>Repetitions: <Text style={{ ...FontStyles.bold }}>{timer.repetitions}</Text></Text>
                </View>
                <View style={styles.rightSide}>
                    <Text style={FontStyles.default}><Text style={{ ...FontStyles.h1, ...FontStyles.bold }}>{this.state.time}</Text>sec</Text>
                </View>
            </WorkoutCard>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        minHeight: 60,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center' //vertical
    },
    leftSide: {
        flex: 1,
        justifyContent: 'center',
    },
    rightSide: {
        width: '25%',
        alignItems: 'flex-end' //horizontal
    }
});