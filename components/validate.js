class Validator {
    validateSet(set) {
        var durationCheck = false;
        var notesCheck = true;
        var repetitionCheck = false;
        var weightCheck = true;
        if (set) {
            if (set.duration > 0) {
                durationCheck == true;
            }
            if (set.notes.length > 100) {
                notesCheck == false;
            }
            if (set.repetitions > 0) {
                repetitionCheck == true;
            }
            if (!Number.isInteger(set.weight)) {
                weightCheck == false;
            }
        }

        return (durationCheck && notesCheck && repetitionCheck && weightCheck);
    }

    validateExercise(exercise) {
        var nameCheck = false;
        var descriptionCheck = true;
        var setCheck = false;
        if (exercise && exercise.id) {
            if (exercise.name.length > 0 && exercise.name.length < 50) {
                nameCheck == true;
            }
            if (exercise.description.length > 200) {
                descriptionCheck == false;
            }
            if (exercise.exerciseSets.length > 0) {
                setCheck == true;
            }
        }

        return (nameCheck && descriptionCheck && setCheck);
    }

    validateWorkout(workout) {
        var nameCheck = false;
        var exerciseCheck = false;
        if (workout) {
            if (workout.name.length > 0 && workout.name.length < 50) {
                nameCheck == true;
            }
            if (workout.exercises.length > 0) {
                exerciseCheck == true;
            }
        }
        return (nameCheck && exerciseCheck);
    }
}