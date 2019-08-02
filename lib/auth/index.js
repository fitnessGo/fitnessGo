import { fbLoginPermissions } from "../../constants";
import firebase from "react-native-firebase";
import Auth from "../../config/auth";
import { GoogleSignin } from "react-native-google-signin";
import { NetInfo } from "react-native";
const webClientId = require('../../android/app/google-services.json').client[0].oauth_client[2].client_id;

export const handleFbLogin = () => {
return new Promise((resolve, reject) =>{
  Auth.Facebook.login(fbLoginPermissions)
    .then(token => {
      return firebase
        .auth()
        .signInWithCredential(
          firebase.auth.FacebookAuthProvider.credential(token)
        );
    })
    .then(user => { 
      resolve()
     })
    .catch(err => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          alert("Please check your internet connection and try again later.");
        }
        else {
          alert("Couldn't authenticate your Facebook account 🙁");
        }
      });
      throw err;
    });
  })};

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
