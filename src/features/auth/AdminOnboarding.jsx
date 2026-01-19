import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createSchool } from "../../services/adminSchools.service";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function AdminOnboarding() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schoolName.trim()) {
      setError("School name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const schoolRef = await createSchool({
        name: schoolName.trim(),
      });
      // Update admin's university_id
      await updateDoc(doc(db, "users", user.uid), {
        university_id: schoolRef.id,
        admin_onboarding_completed: true,
      });
      // Navigate to admin dashboard after creating school
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.background}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            ...styles.orb,
            top: "10%",
            left: "10%",
            background: "linear-gradient(45deg, #6366F1, #8B5CF6)",
          }}
        />
        <motion.div
          animate={{ x: [-100, 100, -100] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            ...styles.orb,
            bottom: "10%",
            right: "10%",
            background: "linear-gradient(45deg, #10B981, #06B6D4)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.card}
      >
        <div style={styles.header}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            style={styles.iconContainer}
          >
            <Building2 size={48} color="#6366F1" />
          </motion.div>
          <h1 style={styles.title}>Create Your School</h1>
          <p style={styles.subtitle}>
            As an admin, you need to create your school's account first. This
            will allow students to join your school.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={styles.inputGroup}
          >
            <label style={styles.label}>School Name</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Enter your school name"
              style={styles.input}
              disabled={loading}
            />
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.errorBox}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            type="submit"
            disabled={loading || !schoolName.trim()}
            style={{
              ...styles.submitBtn,
              opacity: loading || !schoolName.trim() ? 0.6 : 1,
            }}
            whileHover={!loading && schoolName.trim() ? { scale: 1.02 } : {}}
            whileTap={!loading && schoolName.trim() ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating School...
              </>
            ) : (
              <>
                Create School
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={styles.infoBox}
        >
          <CheckCircle2 size={20} color="#10B981" />
          <div>
            <strong>What happens next?</strong>
            <p>
              Your school will be created and approved automatically. Students
              can then register and select your school.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    fontFamily: "'Montserrat', sans-serif",
  },
  background: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.3,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    maxWidth: "500px",
    width: "100%",
    position: "relative",
    zIndex: 1,
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  iconContainer: {
    marginBottom: "16px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1F2937",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6B7280",
    lineHeight: "1.5",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "16px",
    borderRadius: "12px",
    border: "2px solid #E5E7EB",
    fontSize: "16px",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    backgroundColor: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "8px",
    color: "#DC2626",
    fontSize: "14px",
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "16px",
    backgroundColor: "#6366F1",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  infoBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#F0FDF4",
    border: "1px solid #BBF7D0",
    borderRadius: "12px",
    marginTop: "24px",
  },
};
