class Timer {
    time = 0 //current time left on timer
    constructor(duration) {
        this.duration = duration;
        this.time = duration;
    }
    // Method
    start(callback) {
        this.intervalTimer = setInterval(() => {
            if (this.time > 0) {
                this.time--;
            }
            if (this.time <= 0) {
                this.stop();
            }                
            callback();

        }, 1000);
    }
    stop() {
        clearInterval(this.intervalTimer);
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