import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

/**
 * Sign in to Firebase using the Google ID token from @react-native-google-signin.
 * Returns the Firebase user credential.
 */
export async function signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();

  if (response.type === "cancelled") {
    throw new Error("cancelled");
  }

  const idToken = response.data?.idToken;
  if (!idToken) {
    throw new Error("Failed to get Google credentials");
  }

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(googleCredential);
}

/**
 * Get the Firebase ID token for the currently signed-in user.
 * Forces a fresh token so it is never stale.
 */
export async function getFirebaseIdToken(): Promise<string> {
  const user = auth().currentUser;
  if (!user) {
    throw new Error("No Firebase user signed in");
  }
  return user.getIdToken(true);
}

/**
 * Sign out from Firebase (call on app logout).
 */
export async function firebaseSignOut(): Promise<void> {
  if (auth().currentUser) {
    await auth().signOut();
  }
}
