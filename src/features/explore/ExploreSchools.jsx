import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUniversities } from "../../services/onboarding.service";
import { motion } from "framer-motion";

export default function ExploreSchools() {
  const { userData } = useAuth();
  const location = useLocation();
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);

  useEffect(() => {
    const loadUniversities = async () => {
      const unis = await getUniversities();
      setUniversities(unis);
      setFilteredUniversities(unis);
    };
    loadUniversities();
  }, []);

  useEffect(() => {
    if (location.state?.universityId) {
      // Pre-filter to show the user's university first
      const userUni = universities.find(
        (u) => u.id === location.state.universityId,
      );
      if (userUni) {
        setFilteredUniversities([
          userUni,
          ...universities.filter((u) => u.id !== location.state.universityId),
        ]);
      }
    }
  }, [location.state, universities]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Explore Schools</h1>
      <p>Discover universities and institutions in our network.</p>
      <div style={{ display: "grid", gap: "10px", marginTop: "20px" }}>
        {filteredUniversities.map((uni) => (
          <motion.div
            key={uni.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor:
                uni.id === location.state?.universityId ? "#f0f9ff" : "white",
            }}
          >
            <h3>{uni.name}</h3>
            <p>Type: {uni.type}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
