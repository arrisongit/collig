import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Loader from "./Loader";

export default function OnboardingGuard({ children }) {
  const { user, userData } = useAuth();
  const [completed, setCompleted] = useState(null);

  useEffect(() => {
    if (!user || !userData) return;
    setCompleted(!!userData.onboarding_completed);
  }, [user, userData]);

  if (completed === null && userData) return <Loader />; // Show loader while determining onboarding status

  if (!completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
