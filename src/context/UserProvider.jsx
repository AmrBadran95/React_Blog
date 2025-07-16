import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useReducer } from "react";
import { auth, db } from "../services/firebase";
import Loader from "../components/Loader";
import { UserReducers, initialUserState } from "../reducers/UserReducers";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducers, initialUserState);

  const handleFirebaseError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "This email is already in use.";

      case "auth/invalid-email":
        return "Invalid email address.";

      case "auth/weak-password":
        return "Password must be at least 6 characters.";

      case "auth/user-not-found":
        return "No user found with this email.";

      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect password.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      case "auth/network-request-failed":
        return "Network error. Please check your connection.";

      case "auth/internal-error":
        return "Internal error. Please try again.";

      default:
        return "Something went wrong. Please try again.";
    }
  };

  const signup = async (email, password, username) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      await saveUserToFirestore({ ...user, displayName: username });
      const firestoreUser = await fetchUserFromFirestore(user.uid);
      dispatch({ type: "SET_USER", payload: firestoreUser });
      return user;
    } catch (error) {
      const message = handleFirebaseError(error);
      dispatch({ type: "SET_ERROR", payload: message });
      throw { message, code: error.code };
    }
  };

  const signin = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const firestoreUser = await fetchUserFromFirestore(user.uid);
      dispatch({ type: "SET_USER", payload: firestoreUser });
      return user;
    } catch (error) {
      const message = handleFirebaseError(error);
      dispatch({ type: "SET_ERROR", payload: message });
      throw { message, code: error.code };
    }
  };

  const signout = async () => {
    try {
      dispatch({ type: "SET_LOADING" });
      await signOut(auth);
      dispatch({ type: "SIGN_OUT" });
    } catch (error) {
      const message = handleFirebaseError(error);
      dispatch({ type: "SET_ERROR", payload: message });
    }
  };

  const updateUserPhoto = async (imageURL) => {
    try {
      if (!auth.currentUser) throw new Error("No user is currently logged in.");
      await updateProfile(auth.currentUser, { photoURL: imageURL });
      await auth.currentUser.reload();
      const updatedUser = await fetchUserFromFirestore(auth.currentUser.uid);
      dispatch({ type: "SET_USER", payload: updatedUser });
    } catch (error) {
      const message = "Failed to update profile picture.";
      dispatch({ type: "SET_ERROR", payload: message });
      throw { message, code: error.code };
    }
  };

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: new Date(),
    });
  };

  const fetchUserFromFirestore = async (uid) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  };

  const updateUserProfile = async ({ displayName, photoURL }) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently logged in.");
      await updateProfile(user, { displayName, photoURL });
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { displayName, photoURL }, { merge: true });
      const updatedUser = await fetchUserFromFirestore(user.uid);
      dispatch({ type: "SET_USER", payload: updatedUser });
    } catch (error) {
      const message = "Failed to update user profile.";
      dispatch({ type: "SET_ERROR", payload: message });
      throw { message, code: error.code };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const firestoreUser = await fetchUserFromFirestore(user.uid);
        dispatch({ type: "SET_USER", payload: firestoreUser });
      } else {
        dispatch({ type: "SIGN_OUT" });
      }
    });
    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!state.currentUser;

  return (
    <UserContext.Provider
      value={{
        currentUser: state.currentUser,
        isAuthenticated,
        loading: state.loading,
        error: state.error,
        signup,
        signin,
        signout,
        updateUserPhoto,
        updateUserProfile,
      }}>
      {children}
    </UserContext.Provider>
  );
};
