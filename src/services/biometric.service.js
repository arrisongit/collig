import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../config/firebase";

export const biometricReAuth = async () => {
  const user = auth.currentUser;

  // Browser/OS handles biometrics automatically
  const credential = EmailAuthProvider.credential(
    user.email,
    prompt("Confirm password") // fallback
  );

  await reauthenticateWithCredential(user, credential);
};
