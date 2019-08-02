import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontStyles } from '../../styles/global';
import { BreakTimer } from './Timer'
import Card from '../../components/Card';
import { ExerciseImages } from '../../components/ExerciseImages';

export class TimerView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false,
            selected: false,
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
    changeActiveStateTo(newState) {
        this.setState({ active: newState })
    }
    changeSelectedStateTo(newState) {
        this.setState({ selected: newState })
    }
    changeActiveAndSelectedStateTo(newState) {
        this.setState({ active: newState, selected: newState })
    }
    _onPress = () => {
        this.props.onPress(this.props.index);
    }
    render() {
        let timer = this.props.timer

        let image;
        if (ExerciseImages[timer.exerciseName]) {
            image =
                <Image
                    resizeMode={'contain'}
                    style={ styles.imageStyle }
                    source={ExerciseImages[timer.exerciseName]}
                />
        }

        let timerStyle = { width: this.state.selected ? "100%" : "95%" };
        if (timer instanceof BreakTimer) {
            timerStyle.backgroundColor = '#e2e2e2';
            return (
                <TouchableOpacity onPress={this._onPress}>
                    <Card style={[styles.container, this.props.style, timerStyle]}>
                        <View style={styles.leftSide}>
                            <Text style={[FontStyles.default, styles.textLight]}>Break</Text>
                        </View>
                        <View style={styles.rightSide}>
                            <Text style={[FontStyles.default, styles.textLight]}><Text style={[{ ...FontStyles.h1, ...FontStyles.bold }]}>{timer.time}</Text>sec</Text>
                        </View>
                    </Card>
                </TouchableOpacity>
            )
        }
        timerStyle.backgroundColor = '#fafafa';
        return (
            <TouchableOpacity onPress={this._onPress}>
                <Card style={[styles.container, this.props.style, timerStyle]}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', width: "100%" }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', width: "100%"}}>
                            <View style={styles.leftSide}>
                                <Text style={{ ...styles.textLight, ...FontStyles.default }}>Exercise:  <Text style={{ ...FontStyles.bold, ...styles.textLight }}>{timer.exerciseName}</Text></Text>
                                <Text style={{ ...styles.textLight, ...FontStyles.default }}>Repetitions: <Text style={{ ...FontStyles.bold }}>{timer.repetitions}</Text></Text>
                                {timer.weight != 0 && <Text style={{ ...styles.textLight, ...FontStyles.default }}>Weight: <Text style={{ ...FontStyles.bold }}>{timer.weight}</Text> lbs</Text>}
                            </View>
                            <View style={styles.rightSide}>
                                <Text style={{ ...styles.textLight, ...FontStyles.default }}><Text style={{ ...FontStyles.h1, ...FontStyles.bold }}>{this.state.time}</Text>sec</Text>
                            </View>
                        </View>
                        <View style={{ width: '100%',  alignItems: 'center'  }}>
                            { this.state.selected && image}
                        </View>
                    </View>


                </Card>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        minHeight: 60,
        padding: 5,
        flexDirection: 'row',
        color: '#000000',
        alignItems: 'center' //vertical
    },
    leftSide: {
        flex: 1,
        justifyContent: 'center',
    },
    rightSide: {
        width: '25%',
        alignItems: 'flex-end' //horizontal
    },
    textLight: {
        color: '#000000'
    },
    imageStyle: {
        height: 80
    }
});