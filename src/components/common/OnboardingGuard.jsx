import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function OnboardingGuard({ children }) {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) =>
      setCompleted(snap.data()?.onboarding_completed)
    );
  }, [user]);

  if (completed === null) return null;

  if (!completed) return <Navigate to="/onboarding" replace />;

  return children;
}
