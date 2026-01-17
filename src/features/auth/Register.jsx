import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  AlertCircle,
  CheckCircle2,
  Loader2, // Added Loader icon
} from "lucide-react";
import {
  registerWithEmail,
  signInWithGoogle,
  checkEmailAvailability, // Ensure this is exported from auth.service
} from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { user, userData, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation State
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({
    fullName: false,
    email: false,
    password: false,
  });

  // State for async email check
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const controls = useAnimation();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (userData?.onboarding_completed) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }
  }, [user, userData, authLoading, navigate]);

  // --- 1. Async Email Check Effect ---
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reset email validity if user is typing
    if (email) {
      setValidFields((prev) => ({ ...prev, email: false }));
      // Remove error while typing/checking
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    if (email && emailRegex.test(email)) {
      setIsCheckingEmail(true);

      // Debounce: Wait 500ms after typing stops
      const timeoutId = setTimeout(async () => {
        try {
          const { available } = await checkEmailAvailability(email);

          if (!available) {
            setErrors((prev) => ({
              ...prev,
              email: "This email is already registered.",
            }));
            setValidFields((prev) => ({ ...prev, email: false }));
          } else {
            setValidFields((prev) => ({ ...prev, email: true }));
          }
        } catch (error) {
          console.error("Check failed", error);
        } finally {
          setIsCheckingEmail(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setIsCheckingEmail(false);
    }
  }, [email]);

  // --- 2. Live Validation Logic (Sync) ---
  const validateField = (name, value) => {
    let errorMsg = "";
    let isValid = false;

    if (name === "fullName") {
      if (!value.trim()) {
        errorMsg = "Full name is required";
      } else if (value.trim().length < 2) {
        errorMsg = "Name must be at least 2 characters";
      } else {
        isValid = true;
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMsg = "Email is required";
      } else if (!emailRegex.test(value)) {
        errorMsg = "Please enter a valid email address";
      } else {
        // Validity is handled by useEffect for Email
        return;
      }
    }

    if (name === "password") {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const isLongEnough = value.length >= 8;

      if (!value) {
        errorMsg = "Password is required";
      } else if (!isLongEnough) {
        errorMsg = "Password must be at least 8 characters";
      } else if (!hasUpperCase) {
        errorMsg = "Must contain at least one uppercase letter";
      } else if (!hasLowerCase) {
        errorMsg = "Must contain at least one lowercase letter";
      } else {
        isValid = true;
      }
    }

    // Update state for non-async fields
    if (name !== "email") {
      setErrors((prev) => ({ ...prev, [name]: isValid ? "" : errorMsg }));
      setValidFields((prev) => ({ ...prev, [name]: isValid }));
    } else if (errorMsg) {
      // If regex fails immediately, show error
      setErrors((prev) => ({ ...prev, email: errorMsg }));
    }

    return isValid;
  };

  // --- Handlers ---
  const handleChange = (e, field) => {
    const val = e.target.value;
    if (field === "fullName") setFullName(val);
    if (field === "email") setEmail(val);
    if (field === "password") setPassword(val);

    validateField(field, val);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Final validation check
    const isNameValid = validFields.fullName;
    // For email, we rely on validFields being true (set by the async check)
    const isEmailValid = validFields.email;
    const isPasswordValid = validFields.password;

    if (!isNameValid || !isEmailValid || !isPasswordValid || isCheckingEmail) {
      controls.start("shake");
      return;
    }

    setLoading(true);
    try {
      const { user } = await registerWithEmail(email, password, fullName);
      if (user) {
        navigate("/onboarding");
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message }));
      controls.start("shake");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const { user } = await signInWithGoogle();
      if (user) navigate("/onboarding");
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message }));
      controls.start("shake");
    } finally {
      setLoading(false);
    }
  };

  // --- Background Particles Configuration ---
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const tempParticles = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 100,
      size: Math.random() * 10 + 4,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(tempParticles);
  }, []);

  return (
    <div style={styles.pageContainer}>
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
          animate={{
            y: [window.innerHeight + 50, -100],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={styles.card}
      >
        <div style={styles.header}>
          <motion.h2 style={styles.title}>Create Account</motion.h2>
          <p style={styles.subtitle}>Join us and start your journey</p>
        </div>

        <AnimatePresence>
          {errors.form && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={styles.globalError}
            >
              <AlertCircle size={16} />
              {errors.form}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleRegister} style={styles.form}>
          {/* Full Name Field */}
          <motion.div
            animate={controls}
            variants={shakeVariants}
            style={styles.fieldWrapper}
          >
            <div style={styles.labelRow}>
              <label style={styles.label}>Full Name</label>
              {validFields.fullName && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={styles.validBadge}
                >
                  <CheckCircle2 size={14} color="#38A169" />
                  <span style={styles.validText}>Valid</span>
                </motion.div>
              )}
            </div>
            <div style={styles.inputContainer}>
              <User
                size={18}
                style={styles.inputIcon}
                color={
                  errors.fullName
                    ? "#e74c3c"
                    : validFields.fullName
                    ? "#38A169"
                    : "#F09819"
                }
              />
              <input
                type="text"
                value={fullName}
                onChange={(e) => handleChange(e, "fullName")}
                style={{
                  ...styles.input,
                  borderColor: errors.fullName
                    ? "#e74c3c"
                    : validFields.fullName
                    ? "#38A169"
                    : "rgba(0,0,0,0.1)",
                  backgroundColor: errors.fullName ? "#fff5f5" : "white",
                }}
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={styles.fieldError}
              >
                {errors.fullName}
              </motion.span>
            )}
          </motion.div>

          {/* Email Field with Live Check */}
          <motion.div
            animate={controls}
            variants={shakeVariants}
            style={styles.fieldWrapper}
          >
            <div style={styles.labelRow}>
              <label style={styles.label}>Email Address</label>

              {/* Dynamic Badge: Checking vs Valid */}
              {isCheckingEmail ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={styles.validBadge}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <Loader2 size={14} color="#F09819" />
                  </motion.div>
                  <span style={{ ...styles.validText, color: "#F09819" }}>
                    Checking...
                  </span>
                </motion.div>
              ) : validFields.email ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={styles.validBadge}
                >
                  <CheckCircle2 size={14} color="#38A169" />
                  <span style={styles.validText}>Available</span>
                </motion.div>
              ) : null}
            </div>
            <div style={styles.inputContainer}>
              <Mail
                size={18}
                style={styles.inputIcon}
                color={
                  errors.email
                    ? "#e74c3c"
                    : validFields.email
                    ? "#38A169"
                    : isCheckingEmail
                    ? "#F09819"
                    : "#F09819"
                }
              />
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange(e, "email")}
                style={{
                  ...styles.input,
                  borderColor: errors.email
                    ? "#e74c3c"
                    : validFields.email
                    ? "#38A169"
                    : "rgba(0,0,0,0.1)",
                  backgroundColor: errors.email ? "#fff5f5" : "white",
                }}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={styles.fieldError}
              >
                {errors.email}
              </motion.span>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            animate={controls}
            variants={shakeVariants}
            style={styles.fieldWrapper}
          >
            <div style={styles.labelRow}>
              <label style={styles.label}>Password</label>
              {validFields.password && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={styles.validBadge}
                >
                  <CheckCircle2 size={14} color="#38A169" />
                  <span style={styles.validText}>Strong</span>
                </motion.div>
              )}
            </div>
            <div style={styles.inputContainer}>
              <Lock
                size={18}
                style={styles.inputIcon}
                color={
                  errors.password
                    ? "#e74c3c"
                    : validFields.password
                    ? "#38A169"
                    : "#F09819"
                }
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handleChange(e, "password")}
                style={{
                  ...styles.input,
                  borderColor: errors.password
                    ? "#e74c3c"
                    : validFields.password
                    ? "#38A169"
                    : "rgba(0,0,0,0.1)",
                  backgroundColor: errors.password ? "#fff5f5" : "white",
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={styles.fieldError}
              >
                {errors.password}
              </motion.span>
            )}
            {!validFields.password &&
              password.length > 0 &&
              !errors.password && (
                <span style={styles.hintText}>
                  8+ chars, 1 uppercase, 1 lowercase
                </span>
              )}
          </motion.div>

          {/* Register Button */}
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 20px rgba(240, 152, 25, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || isCheckingEmail} // Disable if loading OR checking email
            style={{
              ...styles.submitBtn,
              opacity: loading || isCheckingEmail ? 0.7 : 1,
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={styles.spinner}
              />
            ) : (
              <>
                Register <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine} />
        </div>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#fafafa" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignUp}
          disabled={loading}
          style={styles.googleBtn}
        >
          <Chrome size={20} color="#EA4335" />
          <span>Sign up with Google</span>
        </motion.button>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <a href="/login" style={styles.loginLink}>
              Login here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ... (Variants and Styles remain the same as previous response, ensure they are included)
const shakeVariants = {
  shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } },
};

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
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
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
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    pointerEvents: "none",
    zIndex: 0,
    boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "24px",
    padding: "32px 24px",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: { textAlign: "center" },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#2D3748",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#718096",
    margin: 0,
    lineHeight: "1.5",
  },
  globalError: {
    backgroundColor: "#FED7D7",
    color: "#C53030",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    overflow: "hidden",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldWrapper: { display: "flex", flexDirection: "column", gap: "6px" },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "20px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#4A5568",
    marginLeft: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  validBadge: { display: "flex", alignItems: "center", gap: "4px" },
  validText: { color: "#38A169", fontSize: "11px", fontWeight: "600" },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "14px 14px 14px 44px",
    borderRadius: "12px",
    border: "2px solid transparent",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    color: "#2D3748",
    boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    zIndex: 2,
    transition: "color 0.3s",
  },
  eyeBtn: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#A0AEC0",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldError: {
    fontSize: "12px",
    color: "#E53E3E",
    marginLeft: "4px",
    fontWeight: "600",
  },
  hintText: {
    fontSize: "11px",
    color: "#718096",
    marginLeft: "4px",
    fontStyle: "italic",
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #FF512F 0%, #F09819 100%)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(240, 152, 25, 0.25)",
    marginTop: "8px",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#A0AEC0",
    margin: "4px 0",
  },
  dividerLine: { flex: 1, height: "1px", backgroundColor: "#E2E8F0" },
  dividerText: { fontSize: "12px", fontWeight: "600", letterSpacing: "1px" },
  googleBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    color: "#4A5568",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  footer: { textAlign: "center", marginTop: "8px" },
  footerText: { fontSize: "14px", color: "#718096" },
  loginLink: { color: "#FF512F", textDecoration: "none", fontWeight: "700" },
};
