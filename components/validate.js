class Validator {
    validateSet(set) {
        var durationCheck = false;
        var notesCheck = false;
        var repetitionCheck = false;
        var weightCheck = false;
        if (set != undefined && set != null) {
            if (set.duration > 0) {
                durationCheck == true;
            }
            if (set.notes.length < 100) {
                notesCheck == true;
            }
            if (set.repetitions > 0) {
                repetitionCheck == true;
            }
            if (Number.isInteger(set.weight)) {
                weightCheck == true;
            }
        }

        if (durationCheck && notesCheck && repetitionCheck && weightCheck) {
            return true;
        }
        else {
            return false;
        }
    }

    validateExercise(exercise) {
        var nameCheck = false;
        var descriptionCheck = false;
        var setCheck = false;
        if (exercise != undefined && exercise != null && exercise.id != null) {
            if (exercise.name.length > 0 && exercise.name.length < 50) {
                nameCheck == true;
            }
            if (exercise.description.length < 200) {
                descriptionCheck == true;
            }
            if (exercise.exerciseSets.length > 0) {
                setCheck == true;
            }
        }

        if (nameCheck && descriptionCheck && setCheck) {
            return true;
        }
        else {
            return false;
        }
    }

    validateWorkout(workout) {
        var nameCheck = false;
        var categoryCheck = false;
        var exerciseCheck = false;
        if (workout != undefined && workout != null) {
            if (workout.name.length > 0 && workout.name.length < 50) {
                nameCheck == true;
            }
            if (workout.category.length > 1) {
                categoryCheck == true;
            }
            if (workout.exercises.length > 0) {
                exerciseCheck == true;
            }
        }

        if (nameCheck && categoryCheck && exerciseCheck) {
            return true;
        }
        else {
            return false;
        }
    }
}