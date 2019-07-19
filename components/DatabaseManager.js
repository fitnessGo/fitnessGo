import firebase from 'react-native-firebase';

export default class DatabaseManager {
    //Get all pre-made workouts 
    static GetAllWorkoutRefsOnce() {
        return new Promise((resolve, reject) => {
            firebase.database().ref('/common/workouts/').once('value').then((snapshot) => {
                var wrks = []
                snapshot.forEach(function (workoutRef) {
                    var workout = workoutRef;
                    wrks.push(workout)
                });
                resolve(wrks);
            });
        });
    }
    static GetAllWorkoutRefsOn() {
        return new Promise((resolve, reject) => {
            firebase.database().ref('/common/workouts/').on('value', snapshot => {
                var wrks = []
                snapshot.forEach(function (workoutRef) {
                    var workout = workoutRef;
                    wrks.push(workout)
                });
                resolve(wrks);
            });
        });
    }
    //Get current user workouts
    static GetCurrentUserSavedDiscoverWorkouts() {
        return new Promise((resolve, reject) => {
            const user = firebase.auth().currentUser;
            if (user) {
                firebase.database().ref("users/" + user.uid + "/workouts/").once('value').then((snapshot) => {
                    var references = []
                    snapshot.forEach(function (workoutRef) {
                        const w = workoutRef.val();
                        if (w.refId)
                            references.push(w.refId)
                    });
                    resolve(references);
                });
            } else {
                resolve(null);
            }
        })
    };
    //Save passed workout to the user library
    static AddWorkoutToUserLibrary(workout) {
        return new Promise((resolve, reject) => {
            const user = firebase.auth().currentUser;
            if (user) {
                const userDataRef = firebase.database().ref("users/" + user.uid + "/workouts/");
                var newWorkoutRef = userDataRef.push();
                workout.id = newWorkoutRef.key;
                newWorkoutRef.set(workout).then(data => {
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject("User not found");
            }
        });
    }
    static AddWorkoutToSharedDirectory(workout) {
        return new Promise((resolve, reject) => {
            //Generate a unique id for this workout (random enough for us) [source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript]
            function uuidv4() {
                return 'xyyx4xxxyx'.replace(/[axy]/g, function (c) {
                    var r = Math.random() * 32 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(32).toUpperCase();
                });
            }
            //Store this workout at a location available for all user upon the request
            const dataRef = firebase.database().ref("common/sharedWorkouts/");
            var newWorkoutRef = dataRef.push();
            //update props
            delete workout.added; //only needed it on this screen
            workout.refId = workout.id; //reference to Discover workout
            const id = uuidv4();
            workout.id = id; //update id (new unique Id)
            newWorkoutRef.set(workout).then(data => {
                resolve(id);
            }).catch(error => {
                reject(error);
            });
        })
    }

    static GetSharedWorkout(codeId) {
        return new Promise((resolve, reject) => {
            firebase.database().ref("common/sharedWorkouts/").orderByChild('id').equalTo(codeId).limitToFirst(1).once("value", function (snapshot) {
                const snapVal = snapshot.val();
                if (snapVal) {
                    resolve(snapVal[Object.keys(snapshot.val())[0]]);
                }
                else {
                    resolve(null)
                }
            }, function (errorObject) {
                reject(errorObject.code);
            });
        });
    }
}
