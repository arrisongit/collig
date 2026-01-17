import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  BookOpen,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
} from "lucide-react";
import {
  getUniversities,
  getDepartments,
  getLevels,
} from "../../services/onboarding.service";

export default function Onboarding() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // For animation direction

  // Data
  const [institutions, setInstitutions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);

  const [formData, setFormData] = useState({
    university_id: userData?.university_id || "",
    university_name: userData?.university_name || "",
    department_id: userData?.department_id || "",
    level_id: userData?.level_id || "",
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unis, deps, levs] = await Promise.all([
          getUniversities(),
          getDepartments(),
          getLevels(),
        ]);
        setInstitutions(unis);
        setDepartments(deps);
        setLevels(levs);
      } catch (error) {
        console.error("Error fetching onboarding data:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  // Background Particles
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const tempParticles = [...Array(15)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 100,
      size: Math.random() * 12 + 4,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(tempParticles);
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "university_id") {
      const institution = institutions.find((inst) => inst.id === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        university_name: institution?.name || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isStepComplete = () => {
    if (step === 1) return !!formData.university_id;
    if (step === 2) return !!formData.department_id;
    if (step === 3) return !!formData.level_id;
    return false;
  };

  const nextStep = () => {
    if (step < 3) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        university_id: formData.university_id,
        university_name: formData.university_name,
        department_id: formData.department_id,
        level_id: formData.level_id,
        onboarding_completed: true,
      });

      const role = userData?.role || "student";
      navigate(
        role === "admin" || role === "super_admin" ? "/admin" : "/dashboard"
      );
    } catch (err) {
      console.error("Error completing onboarding:", err);
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div style={styles.pageContainer}>
      {/* Background */}
      <div style={styles.backgroundGradient} />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            ...styles.particle,
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [window.innerHeight + 50, -100], opacity: [0, 0.4, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={styles.card}
      >
        {/* Progress Header */}
        <div style={styles.progressContainer}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={styles.stepIndicatorWrapper}>
              <motion.div
                animate={{
                  backgroundColor: s <= step ? "#F09819" : "rgba(0,0,0,0.1)",
                  scale: s === step ? 1.2 : 1,
                }}
                style={styles.stepCircle}
              >
                {s < step ? (
                  <Check size={14} color="white" />
                ) : (
                  <span
                    style={{
                      color: s <= step ? "white" : "#999",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {s}
                  </span>
                )}
              </motion.div>
              {s < 3 && (
                <div
                  style={{
                    ...styles.stepLine,
                    backgroundColor: s < step ? "#F09819" : "#eee",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div style={styles.contentWrapper}>
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1: UNIVERSITY */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={styles.stepContent}
              >
                <div style={styles.iconWrapper}>
                  <Building2 size={32} color="#F09819" />
                </div>
                <h2 style={styles.title}>Select Institution</h2>
                <p style={styles.subtitle}>
                  Which university or college do you attend?
                </p>

                <div style={styles.selectWrapper}>
                  <select
                    name="university_id"
                    value={formData.university_id}
                    onChange={handleChange}
                    style={styles.select}
                    disabled={dataLoading}
                  >
                    <option value="">Select University...</option>
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DEPARTMENT */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={styles.stepContent}
              >
                <div style={styles.iconWrapper}>
                  <BookOpen size={32} color="#F09819" />
                </div>
                <h2 style={styles.title}>Select Department</h2>
                <p style={styles.subtitle}>
                  What is your major or field of study?
                </p>

                <div style={styles.selectWrapper}>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    style={styles.select}
                    disabled={dataLoading}
                  >
                    <option value="">Select Department...</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* STEP 3: LEVEL */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={styles.stepContent}
              >
                <div style={styles.iconWrapper}>
                  <GraduationCap size={32} color="#F09819" />
                </div>
                <h2 style={styles.title}>Academic Level</h2>
                <p style={styles.subtitle}>
                  What year or level are you currently in?
                </p>

                <div style={styles.selectWrapper}>
                  <select
                    name="level_id"
                    value={formData.level_id}
                    onChange={handleChange}
                    style={styles.select}
                    disabled={dataLoading}
                  >
                    <option value="">Select Level...</option>
                    {levels.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div style={styles.footer}>
          {step > 1 ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={prevStep}
              style={styles.backBtn}
            >
              <ChevronLeft size={20} /> Back
            </motion.button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              disabled={!isStepComplete()}
              style={{ ...styles.nextBtn, opacity: isStepComplete() ? 1 : 0.5 }}
            >
              Next <ChevronRight size={20} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              disabled={loading || !isStepComplete()}
              style={{
                ...styles.completeBtn,
                opacity: isStepComplete() ? 1 : 0.5,
              }}
            >
              {loading ? (
                <Loader2 className="spin" size={20} />
              ) : (
                "Finish Setup"
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  pageContainer: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #FF512F 0%, #F09819 100%)",
    zIndex: -1,
  },
  particle: {
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    pointerEvents: "none",
    zIndex: 0,
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    minHeight: "500px", // Fixed height for smooth transitions
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "40px",
    padding: "0 20px",
  },
  stepIndicatorWrapper: {
    display: "flex",
    alignItems: "center",
  },
  stepCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  stepLine: {
    width: "60px",
    height: "3px",
    margin: "0 -2px",
    zIndex: 1,
  },
  contentWrapper: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stepContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  iconWrapper: {
    width: "80px",
    height: "80px",
    backgroundColor: "rgba(240, 152, 25, 0.1)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#333",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
    maxWidth: "80%",
  },
  selectWrapper: {
    width: "100%",
    position: "relative",
  },
  select: {
    width: "100%",
    padding: "16px 20px",
    fontSize: "16px",
    border: "2px solid #eee",
    borderRadius: "12px",
    backgroundColor: "white",
    outline: "none",
    appearance: "none", // Remove default arrow
    cursor: "pointer",
    color: "#333",
    fontWeight: "500",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    transition: "border-color 0.2s",
  },
  footer: {
    marginTop: "auto",
    paddingTop: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    color: "#666",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  nextBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "30px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  completeBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(90deg, #FF512F 0%, #F09819 100%)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "30px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(240, 152, 25, 0.3)",
  },
};
