import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";

export default function AdminGuard({ children }) {
  const { user } = useAuth();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (!user) return;

    getDoc(doc(db, "users", user.uid)).then((snap) => {
      const role = snap.data()?.role;
      setAllowed(role === "admin" || role === "super_admin");
    });
  }, [user]);

  if (allowed === null) return null;
  if (!allowed) return <Navigate to="/" replace />;

  return children;
}
