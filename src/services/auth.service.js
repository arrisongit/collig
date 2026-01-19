import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
// 1. Updated Imports here
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { getFriendlyAuthError } from "../utils/firebaseErrors";

const googleProvider = new GoogleAuthProvider();

/**
 * CHECK IF EMAIL EXISTS (For Live Validation)
 */
export const checkEmailAvailability = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    // If methods array is empty, email is available
    return { available: methods.length === 0 };
  } catch (error) {
    console.error("Error checking email availability:", error);
    // In case of error, assume available to not block registration
    return { available: true };
  }
};

/**
 * REGISTER WITH EMAIL + PASSWORD
 */
export const registerWithEmail = async (
  email,
  password,
  fullName,
  role = "student",
  university_id = null,
) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Check for existing admin if registering as admin
    if (role === "admin" && university_id) {
      const adminQuery = query(
        collection(db, "users"),
        where("role", "==", "admin"),
        where("university_id", "==", university_id),
      );
      const adminSnap = await getDocs(adminQuery);
      if (!adminSnap.empty) {
        // Delete the created user
        await user.delete();
        throw new Error(
          "This school already has an admin. You cannot register as admin for this school.",
        );
      }
    }

    // Get ID token
    const token = await user.getIdToken();

    // Create Firestore profile
    const userData = {
      uid: user.uid,
      full_name: fullName,
      email: user.email,
      role: role,
      university_id: university_id,
      department_id: null,
      level_id: null,
      created_at: serverTimestamp(),
    };

    if (role === "student") {
      userData.onboarding_completed = false;
    } else if (role === "admin") {
      userData.admin_onboarding_completed = false;
    }

    await setDoc(doc(db, "users", user.uid), userData);

    // Save session to localStorage
    localStorage.setItem(
      "auth_session",
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        token,
      }),
    );

    return { user, token };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      // Check if the email is associated with Google
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error(
          "This email is already registered with Google. Please try logging in with Google instead.",
        );
      } else {
        throw new Error(
          "This email is already registered. Please try logging in instead.",
        );
      }
    }
    throw error;
  }
};

/**
 * Email / Password Login
 */
export const loginWithEmail = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const token = await user.getIdToken();

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      throw new Error("User account not found. Please register.");
    }

    return { user, token, userData: snap.data() };
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
};

/**
 * Google Login
 */
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const token = await user.getIdToken();

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      throw new Error("No account found. Please register first.");
    }

    return { user, token, userData: snap.data() };
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
};

/**
 * LOGOUT
 */
export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("auth_session");
};

/**
 * GET STORED SESSION
 */
export const getStoredSession = () => {
  const session = localStorage.getItem("auth_session");
  return session ? JSON.parse(session) : null;
};
