import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { getFriendlyAuthError } from "../utils/firebaseErrors";

const googleProvider = new GoogleAuthProvider();

/* ----------------------------------------------------
   EMAIL AVAILABILITY (LIVE VALIDATION)
---------------------------------------------------- */
export const checkEmailAvailability = async (email) => {
  try {
    const ref = doc(db, "registered_emails", email.toLowerCase());
    const snap = await getDoc(ref);
    return { available: !snap.exists() };
  } catch {
    return { available: false };
  }
};

/* ----------------------------------------------------
   REGISTER WITH EMAIL + PASSWORD
---------------------------------------------------- */
export const registerWithEmail = async (email, password, fullName) => {
  try {
    email = email.toLowerCase();

    // ✅ Check registered_emails ONLY
    const emailRef = doc(db, "registered_emails", email);
    const emailSnap = await getDoc(emailRef);
    if (emailSnap.exists()) {
      throw new Error("This email is already registered.");
    }

    // ✅ Create Auth account
    console.log(auth, email, password);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // ✅ Create Firestore profile
    const userData = {
      full_name: fullName,
      email,
      role: "user",
      onboarding_completed: false,
      university_id: null,
      created_at: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    // ✅ Lock email
    await setDoc(emailRef, {
      email,
      uid: user.uid,
      created_at: serverTimestamp(),
    });

    return { user, userData };
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
};

/* ----------------------------------------------------
   EMAIL / PASSWORD LOGIN
---------------------------------------------------- */
export const loginWithEmail = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) {
      throw new Error("Account profile missing. Please contact support.");
    }

    return { user, userData: snap.data() };
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
};

/* ----------------------------------------------------
   GOOGLE SIGN IN (AUTO-PROFILE CREATION)
---------------------------------------------------- */
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    /* 🔁 Existing user */
    if (snap.exists()) {
      return { user, userData: snap.data() };
    }

    /* 🆕 First-time Google user */
    const userData = {
      full_name: user.displayName || "",
      email: user.email.toLowerCase(),
      role: "user",
      university_id: null,
      created_at: serverTimestamp(),
      onboarding_completed: false,
    };

    await setDoc(userRef, userData);

    /* 🔐 Lock email */
    await setDoc(doc(db, "registered_emails", user.email.toLowerCase()), {
      email: user.email.toLowerCase(),
      uid: user.uid,
      created_at: serverTimestamp(),
    });

    return { user, userData };
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
};

/* ----------------------------------------------------
   LOGOUT
---------------------------------------------------- */
export const logout = async () => {
  await signOut(auth);
};
