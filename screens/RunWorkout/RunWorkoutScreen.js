import React, { Component } from 'react';
import { Text, View, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
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
            darkTheme: true,
            countdownToStart: -1
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
                    onRef={(child) => { this.timerViewsRefs.push(child); }} />)
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
        if (this.timerRunning) {
            this.pause();
        } else {
            this.timerRunning = true;
            this.play();
        }

    }
    play() {
        this.timerRunning = true;
        this.startCountdownToStart( () => {
            console.warn("Return from countdown func back to play")
            //timer has not been started yet
            if (this.activeTimerIndex === null) {
                this.activeTimerIndex = 0;
                this.switchTimer(0);
            } else {
                this.switchTimer(this.activeTimerIndex);
            }
        })
    }
    pause() {
        this.timerRunning = false;
        if(this.countdownIntervalTimer){
            clearInterval(this.countdownIntervalTimer);
        }
        this.setState(previousState => (
            { countdownToStart: -1 })
        )
        if (this.activeTimerIndex != null) {
            const activeTimer = this.timers[this.activeTimerIndex];
            const activeTimerViewRef = this.timerViewsRefs[this.activeTimerIndex];
            activeTimerViewRef.changeActiveStateTo(this.timerRunning);
            activeTimer.stop(callback = () => {
                //TODO: better way than changing a state? 
                activeTimerViewRef.setState({ time: activeTimer.time })
            })
        }
        
    }
    switchTimer(index) {
        this.activeTimerIndex = index
        if (this.activeTimerIndex === null) {
            this.activeTimerIndex = 0
        } else if (this.activeTimerIndex >= this.timers.length) {

        } else {
            const activeTimer = this.timers[this.activeTimerIndex];
            const activeTimerViewRef = this.timerViewsRefs[this.activeTimerIndex];
            activeTimerViewRef.changeActiveStateTo(this.timerRunning);
            activeTimer.start(callback = () => {
                activeTimerViewRef.setState({ time: activeTimer.time })
                if (activeTimer.time === 0) {
                    activeTimerViewRef.changeActiveState();
                    this.switchTimer(this.activeTimerIndex + 1);
                }
            })
        }
    }
    startCountdownToStart(callback) {
        var time = 3
        this.setState(previousState => ({ countdownToStart: time }))
        this.countdownIntervalTimer = setInterval(() => {
            time--;
            this.setState(previousState => ({ countdownToStart: time }))
            if (time < 0) { 
                clearInterval(this.countdownIntervalTimer);
                this.setState(({ countdownToStart: time }))
                callback();
            }
        }, 1000);
    }
    //Workout completed
    lastTimerFinished() {

    }
    render() {
        const theme = getStyleSheet(this.state.darkTheme);
        // const workoutViewStyle = this.state.darkTheme ? styles.workoutViewDark : styles.workoutViewLight
        let playIconName = this.timerRunning ? "pause-circle-outline" : "play-circle-outline"
        let countdown;
        if (this.state.countdownToStart >= 0 ) {
            countdown =
                <View style={styles.countdownOverlay}>
                    <Text style={{fontSize:styles.countdownOverlay.fontSize}}>{this.state.countdownToStart}</Text>
                </View>
        }
        return (
            <SafeAreaView style={[ScreenStyles.screenContainer, theme.background]} >
                <ScrollView style={ScreenStyles.screenContainer}>
                    <View style={styles.container}>
                        {this.timerViews}
                    </View>
                </ScrollView>
                {countdown}
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
    },
    countdownOverlay: {
        backgroundColor: 'white',
        width: '50%',
        aspectRatio: 1,
        position: 'absolute',
        fontSize: 60,
        left: '25%',
        top: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1000,
        shadowColor: 'black',
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        elevation: 4
    }
});

export default RunWorkoutScreen;