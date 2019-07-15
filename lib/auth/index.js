import { fbLoginPermissions } from "../../constants";
import firebase from "react-native-firebase";
import Auth from "../../config/auth";
import { GoogleSignin } from "react-native-google-signin";
const webClientId = require('../../android/app/google-services.json').client[0].oauth_client[2].client_id;

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
  Auth.Facebook.logout().catch(err => {
    throw err;
  });

export async function handleGoogleLogin() {
  try {
    await GoogleSignin.configure({
      webClientId: webClientId
    });
    const data = await GoogleSignin.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(
      data.idToken,
      data.accessToken
    );
    const firebaseUserCredential = await firebase
      .auth()
      .signInWithCredential(credential);
  } catch (error) {
    throw error;
  }
}

export const handleGoogleLogout = async () => {
  try {
    await GoogleSignin.configure({
      webClientId: webClientId
    });
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    throw error;
  }
};

export const handleLogout = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      handleGoogleLogout();
    } else {
      handleFbLogout();
    }
  } catch (error) {
    console.error(error);
  }
};
