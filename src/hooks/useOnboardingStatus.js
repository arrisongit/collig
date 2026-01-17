import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

export const useOnboardingStatus = async () => {
  const { user } = useAuth();
  if (!user) return null;

  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.data()?.onboarding_completed;
};
