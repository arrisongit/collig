import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function OnboardingGuard({ children }) {
  const { user, userData } = useAuth();
  const [completed, setCompleted] = useState(null);

  useEffect(() => {
    if (!user || !userData) return;
    const role = userData.role;
    if (role === "student") {
      setCompleted(userData.onboarding_completed);
    } else if (role === "admin") {
      setCompleted(userData.admin_onboarding_completed);
    } else {
      setCompleted(true); // super_admin or others
    }
  }, [user, userData]);

  if (completed === null) return null;

  if (!completed) {
    if (userData?.role === "student") {
      return <Navigate to="/onboarding" replace />;
    } else if (userData?.role === "admin") {
      return <Navigate to="/admin-onboarding" replace />;
    }
  }

  return children;
}
