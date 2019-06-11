import React, { Component } from 'react';
import { View, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { BreakTimer, SetTimer } from './Timer'
import { ScreenStyles } from '../../styles/global';
import getStyleSheet from "../../styles/themestyles";
import { TimerView } from './TimerView'

class RunWorkoutScreen extends Component {
    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;
        this.state = {
            darkTheme: false,
            timerRunning: false
        }
        this.workout = params.workout
        this.constructTimers()
        this._onPlayButtonClick = this._onPlayButtonClick.bind(this);

        this.activeTimerIndex = null
        this.timerRunning = false
    }
    constructTimers() {
        //parallel arrays of data and views to handle pausing and switching active timers
        this.timers = [];
        this.timerViews = [];
        //to access child method from parent. needed to update Text in child
        this.timerViewsRefs = [];
        for (var i = 0; i < this.workout.exercises.length; i++) {
            const exercise = this.workout.exercises[i];
            for (var j = 0; j < exercise.exerciseSets.length; j++) {
                const s = exercise.exerciseSets[j]
                let timer = new SetTimer(exercise.name, s.duration, s.repetitions);
                this.timers.push(timer)
                this.timerViews.push(<TimerView timer={timer} style={{ marginBottom: 10 }}
                     onRef={ (child) => { this.timerViewsRefs.push(child) }} />)
                if (s.break > 0) {
                    let timer = new BreakTimer(s.break)
                    this.timers.push(timer)
                    this.timerViews.push(<TimerView timer={timer} style={{ marginBottom: 10 }}
                        onRef={child => { this.timerViewsRefs.push(child) }} />)
                }
            }
        }
        if (this.childRef != undefined) {

        }
    }

    _onNextButtonClick() {
        alert("This functionality will be added soon")
    }
    _onPreviousButtonClick() {
        alert("This functionality will be added soon")
    }
    
    _onPlayButtonClick() {
        if (this.timerRunning)
        {
            this.pause();
        } else {
            this.timerRunning = true;
            this.play();
        }
        
    }
    play() {
        this.setState(previousState => (
            { timerRunning: !previousState.timerRunning }
        ))
        //timer has not been started yet
        if (this.activeTimerIndex === null) {
            this.activeTimerIndex = 0
        }
        const activeTimer = this.timers[this.activeTimerIndex];
        const activeTimerViewRef = this.timerViewsRefs[this.activeTimerIndex];
        activeTimerViewRef.changeActiveState();
        activeTimer.start( callback = () => {
            //TODO: better way than changing a state? 
            activeTimerViewRef.setState({time: activeTimer.time})
        })
    }
    pause() {
        this.timerRunning = false;
        this.setState(previousState => (
            { timerRunning: !previousState.timerRunning })
        )
        const activeTimer = this.timers[this.activeTimerIndex];
        const activeTimerViewRef = this.timerViewsRefs[this.activeTimerIndex];
        activeTimerViewRef.changeActiveState();
        activeTimer.stop( callback = () => {
            //TODO: better way than changing a state? 
            activeTimerViewRef.setState({time: activeTimer.time})
        })
    }
    render() {
        const theme = getStyleSheet(this.state.darkTheme);
        let playIconName = this.state.timerRunning ? "pause-circle-outline" : "play-circle-outline"
        return (
            <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]} >
                <ScrollView style={ScreenStyles.screenContainer}>
                    <View style={styles.container}>
                        {this.timerViews}
                    </View>
                </ScrollView>
                <View style={styles.playMenuContainer}>
                    <Button
                        type="clear"
                        icon={
                            <Icon type='MaterialIcons'
                                name="skip-previous"
                                size={44}
                                color={theme.text.color} />}
                        style={{ alignSelf: 'flex-end' }}
                        onPress={this._onPreviousButtonClick}
                    />
                    <Button
                        type="clear"
                        icon={
                            <Icon type='MaterialIcons'
                                name={playIconName}
                                size={44}
                                color={theme.text.color} />}
                        style={{ alignSelf: 'flex-end' }}
                        onPress={this._onPlayButtonClick}
                    />
                    <Button
                        type="clear"
                        icon={
                            <Icon type='MaterialIcons'
                                name="skip-next"
                                size={44}
                                color={theme.text.color} />}
                        style={{ alignSelf: 'flex-end' }}
                        onPress={this._onNextButtonClick}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        left: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4
    },
    playMenuContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default RunWorkoutScreen;