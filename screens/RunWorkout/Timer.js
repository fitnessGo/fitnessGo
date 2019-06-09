class Timer {
    time = 0 //current time left on timer
    constructor(duration) {
        this.duration = duration;
        this.time = duration;
    }
    // Method
    reset() {
        this.time = duration;
    }
    start(callback) {
        this.intervalTimer = setInterval(() => {
            if(this.time > 1) {
                this.time--;
                callback();
            } else {
                this.stop(callback)
            }
        }, 1000);
    }
    stop(callback) {
        clearInterval(this.intervalTimer);
        callback();
        //calback to parent about the timer stop
    }
    reset() {
        this.time = this.duration;
    }
}
export class BreakTimer extends Timer {
    constructor(duration) {
        super(duration);
    }
}
export class SetTimer extends Timer {
    constructor(exerciseName, duration, repetitions) {
        super(duration)
        this.exerciseName = exerciseName;
        this.repetitions = repetitions;
    }
}