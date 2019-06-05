import { fbLoginPermissions } from "../../constants";
import firebase from "react-native-firebase";
import Auth from "../../config/auth";
export const handleFbLogin = () =>
  Auth.Facebook.login(fbLoginPermissions)
    .then(token => {
      firebase
        .auth()
        .signInWithCredential(
          firebase.auth.FacebookAuthProvider.credential(token)
        );
    })
    .catch(err => {
      throw err;
    });
