import React, { Component } from 'react';
import { Animated, View, ScrollView, SafeAreaView, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { BreakTimer, SetTimer } from './Timer'
import { ScreenStyles } from '../../styles/global';
import getStyleSheet from "../../styles/themestyles";
import { TimerView } from './TimerView'
import Sound from 'react-native-sound';

class RunWorkoutScreen extends Component {
    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;

        this.state = {
            darkTheme: window.darkTheme,
            countdownToStart: -1,
            playButtonPressed: false
        }
        this.countdownOpacity = new Animated.Value(0)
        this.workout = params.workout
        this.constructTimers()
        this._onPlayButtonClick = this._onPlayButtonClick.bind(this);
        this._onNextButtonClick = this._onNextButtonClick.bind(this);
        this._onPreviousButtonClick = this._onPreviousButtonClick.bind(this);

        this.activeTimerIndex = null
    }
    componentDidMount() {
        //FIXME: length check can be removed when we make sure workouts have sets
        if (this.timerViewsRefs.length > 0) {
            this.timerViewsRefs[0].changeSelectedStateTo(true);
            this.activeTimerIndex = 0
        }
        this.sound_countdown = new Sound('beep01.flac', Sound.MAIN_BUNDLE);
        this.sound_whistle = new Sound('whistle01.wav', Sound.MAIN_BUNDLE);
        this.sound_timer_ring = new Sound('timer_ring.wav', Sound.MAIN_BUNDLE);
        this.sound_complete = new Sound('complete_chime.mp3', Sound.MAIN_BUNDLE);
    }
    componentWillUnmount() {
        if (this.countdownIntervalTimer) {
            clearInterval(this.countdownIntervalTimer);
        }
        //make sure nothing was left running
        this.timers[this.activeTimerIndex].stop();
    }
    onTimerSelect(index) {
        if (this.activeTimerIndex !== index)
            this.switchTimer(index);
    }
    constructTimers() {
        //parallel arrays of data and views to handle pausing and switching active timers
        this.timers = [];
        this.timerViews = [];
        //to access child method from parent. needed to update Text in child
        this.timerViewsRefs = [];
        let index = 0;
        for (var i = 0; i < this.workout.exercises.length; i++) {
            const exercise = this.workout.exercises[i];
            for (var j = 0; j < exercise.exerciseSets.length; j++) {

                const s = exercise.exerciseSets[j]
                let timer = new SetTimer(exercise.name, s.duration, s.repetitions);
                this.timers.push(timer)
                this.timerViews.push(<TimerView timer={timer} index={index} onPress={(index) => { this.onTimerSelect(index) }} style={{ marginBottom: 10 }}
                    onRef={(child) => { this.timerViewsRefs.push(child); }} />)
                index++;
                if (s.break > 0) {
                    let timer = new BreakTimer(s.break)
                    this.timers.push(timer)
                    this.timerViews.push(<TimerView timer={timer} index={index} onPress={(index) => { this.onTimerSelect(index) }} style={{ marginBottom: 10 }}
                        onRef={child => { this.timerViewsRefs.push(child) }} />)
                    index++;
                }
            }
        }
    }

    _onNextButtonClick() {
        this.switchTimer(this.activeTimerIndex + 1)
    }
    _onPreviousButtonClick() {
        this.switchTimer(this.activeTimerIndex - 1)
    }
    _onPlayButtonClick() {
        this.setState({ playButtonPressed: !this.state.playButtonPressed });
        if (this.timerRunning || this.countdownRunning) {
            this.pause();
        } else {
            this.play();
        }
    }
    play() {
        //start a countdown 
        this.countdownRunning = true // need to show or hide overlay
        this.startCountdownToStart(() => {
            //start a currently selected timer after the countdown was finished

            let activeTimerViewRef = this.switchTimer(this.activeTimerIndex);
            const activeTimer = this.timers[this.activeTimerIndex];

            this.timerRunning = true;
            this.countdownRunning = false
            activeTimer.start(callback = () => {
                activeTimerViewRef.setState({ time: activeTimer.time })
                //play signal when time is 3,2,1 before the next timer
                if (activeTimer.time <= 3 && activeTimer.time > 0) {
                    this.sound_countdown.play();
                }
                if (activeTimer.time === 0) {
                    if (activeTimer instanceof BreakTimer) {
                        //when it is a break timer play whistle single to indicate the start of an exercise
                        this.sound_whistle.play();
                    } else {
                        //otherwise indicate the start of the break
                        this.sound_timer_ring.play();
                    }
                    activeTimerViewRef.changeActiveState();
                    this.switchTimer(this.activeTimerIndex + 1);
                }
            })
        })
    }
    pause() {
        //paused during countdown
        if (this.countdownRunning) {
            clearInterval(this.countdownIntervalTimer);
            this.countdownRunning = false
            this.setState({ timerRunning: false, countdownToStart: -1 })
            this.countdownOpacity = new Animated.Value(0)
        }
        //check if timer started or the user paused during countdown from 3
        else if (this.timerRunning) {
            //timer was running. stop interval timer, change view state
            const activeTimer = this.timers[this.activeTimerIndex];
            const activeTimerViewRef = this.timerViewsRefs[this.activeTimerIndex];
            activeTimerViewRef.changeActiveStateTo(false);
            activeTimer.stop();
        }
        this.timerRunning = false;
        this.countdownRunning = false
    }
    //Reusable method to start a particular timer
    switchTimer(index) {
        //if no timer running, just switch but don't start 
        if (!this.timerRunning) {
            //if the timer index switching to is valid
            if (index >= 0 && index < this.timers.length) {
                //Change state of active timer
                let activeTimerViewRef = this.timerViewsRefs[this.activeTimerIndex];
                activeTimerViewRef.changeSelectedStateTo(false);
                //chagne active timer to passed timer index
                this.activeTimerIndex = index;
                if (this.activeTimerIndex >= 0 && this.activeTimerIndex < this.timers.length) {
                    activeTimerViewRef = this.timerViewsRefs[this.activeTimerIndex];
                    activeTimerViewRef.changeSelectedStateTo(true);
                    return activeTimerViewRef;
                }
            }
        }
        //if timer was running
        // 1) stop current timer
        {
            const activeTimer = this.timers[this.activeTimerIndex];
            activeTimer.stop();
            activeTimer.reset();
            const activeTimerViewRef = this.timerViewsRefs[this.activeTimerIndex];
            activeTimerViewRef.changeActiveAndSelectedStateTo(false);
            activeTimerViewRef.setState({ time: activeTimer.time })
        }
        // 2) if it in not the last timer - go to the next timer
        if (index >= 0 && index < this.timers.length) {
            this.activeTimerIndex = index;
            const activeTimer = this.timers[this.activeTimerIndex];
            const activeTimerViewRef = this.timerViewsRefs[this.activeTimerIndex];
            activeTimerViewRef.changeActiveAndSelectedStateTo(this.timerRunning);
            activeTimer.start(callback = () => {
                activeTimerViewRef.setState({ time: activeTimer.time })
                if (activeTimer.time <= 3 && activeTimer.time > 0) {
                    this.sound_countdown.play();
                }
                if (activeTimer.time === 0) {
                    if (index < this.timers.length-1) {
                        
                        if (activeTimer instanceof BreakTimer) {
                            //when it is a break timer play whistle single to indicate the start of an exercise
                            this.sound_whistle.play();
                        } else {
                            //otherwise indicate the start of the break
                            this.sound_timer_ring.play();
                        }
                    }
                    else {
                        //if last timer make end of workout signal
                        this.sound_complete.play();
                    }
                    activeTimerViewRef.changeActiveState();
                    this.switchTimer(this.activeTimerIndex + 1);
                }
            })

        }
        // 3) otherwise show message that the workout is completed
        else {
            this.lastTimerFinished();
        }
    }

    //Shows overlay view and starts a countdown from 3
    startCountdownToStart(callback) {
        var time = 3
        this.setState(previousState => ({ countdownToStart: time }))
        Animated.timing(this.countdownOpacity, { toValue: 1, duration: 500 }).start();
        this.sound_countdown.play();
        this.countdownIntervalTimer = setInterval(() => {
            time--;
            if (time > 0) {
                this.setState(previousState => ({ countdownToStart: time }))
                this.sound_countdown.play();
            }
            else if (time == 0) {
                this.setState(previousState => ({ countdownToStart: time }))
                this.sound_whistle.play();
            }
            else {
                //time < 0
                clearInterval(this.countdownIntervalTimer);
                Animated.timing(this.countdownOpacity, { toValue: 0, duration: 500 }).start();
                callback();
            }
        }, 1000);
    }
    //Workout completed
    lastTimerFinished() {
        //TODO: Add Sound & nice alert
        this.timerRunning = false;
        this.setState({ playButtonPressed: false });
        this.timerViewsRefs[0].changeSelectedStateTo(true);
        this.activeTimerIndex = 0
        alert("Workout completed")
    }
    render() {
        const theme = getStyleSheet(this.state.darkTheme);
        // const workoutViewStyle = this.state.darkTheme ? styles.workoutViewDark : styles.workoutViewLight
        let playIconName = this.state.playButtonPressed ? "pause-circle-outline" : "play-circle-outline"
        let countdown;
        if (this.state.countdownToStart >= 0) {
            countdown =
                <Animated.View style={[styles.countdownOverlay, { opacity: this.countdownOpacity }]}>
                    <Text style={{ fontSize: styles.countdownOverlay.fontSize, color: '#ffffff' }}>{this.state.countdownToStart}</Text>
                </Animated.View>
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
        width: '92%',
        left: '4%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4
    },
    playMenuContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    countdownOverlay: {
        backgroundColor: '#ff754c',
        width: '60%',
        aspectRatio: 1,
        position: 'absolute',
        fontSize: 60,
        left: '20%',
        top: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1000,
        shadowColor: '#000000',
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        elevation: 4
    }
});

export default RunWorkoutScreen;