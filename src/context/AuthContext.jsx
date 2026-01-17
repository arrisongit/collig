import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Get ID token
        const idToken = await currentUser.getIdToken();
        setToken(idToken);

        // Fetch user profile from Firestore
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));
        const profile = userSnap.data();
        setUserData(profile);

        // Update localStorage
        localStorage.setItem(
          "auth_session",
          JSON.stringify({
            uid: currentUser.uid,
            email: currentUser.email,
            token: idToken,
          })
        );
      } else {
        setUser(null);
        setUserData(null);
        setToken(null);
        localStorage.removeItem("auth_session");
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
