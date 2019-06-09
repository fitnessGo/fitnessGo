import { fbLoginPermissions } from "../../constants";
import firebase from "react-native-firebase";
import Auth from "../../config/auth";
import { GoogleSignin } from "react-native-google-signin";

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

export const handleFbLogout = () =>
  Auth.Facebook.logout()
    .then(res => {
      firebase.auth().signOut();
    })
    .catch(err => {
      throw err;
    });

export async function handleGoogleLogin() {
  try {
    await GoogleSignin.configure();
    const data = await GoogleSignin.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(
      data.idToken,
      data.accessToken
    );
    const firebaseUserCredential = await firebase
      .auth()
      .signInWithCredential(credential);
  } catch (e) {
    throw err;
  }
};

export const handleGoogleLogout = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    firebase.auth().signOut();
  } catch (error) {
    console.error(error);
  }
};

export const handleLogout = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if(isSignedIn) {
      handleGoogleLogout();
    } else {
      handleFbLogout();
    }
  } catch(error) {
    console.error(error);
  }
}