import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { loginWithEmail, signInWithGoogle } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { user, userData, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation State
  const [errors, setErrors] = useState({});
  // Track if a field is valid to show the green checkmark
  const [validFields, setValidFields] = useState({
    email: false,
    password: false,
  });

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

  // --- Live Validation Logic ---
  const validateField = (name, value) => {
    let errorMsg = "";
    let isValid = false;

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMsg = "Email is required";
      } else if (!emailRegex.test(value)) {
        errorMsg = "Please enter a valid email address";
      } else {
        isValid = true;
      }
    }

    if (name === "password") {
      // Rules: Min 8 chars, 1 Uppercase, 1 Lowercase
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

    // Update state
    setErrors((prev) => ({ ...prev, [name]: isValid ? "" : errorMsg }));
    setValidFields((prev) => ({ ...prev, [name]: isValid }));

    return isValid;
  };

  // --- Handlers ---
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    validateField("email", val);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    validateField("password", val);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Final check before submission
    const isEmailValid = validateField("email", email);
    const isPasswordValid = validateField("password", password);

    if (!isEmailValid || !isPasswordValid) {
      controls.start("shake");
      return;
    }

    setLoading(true);
    try {
      const { user, userData } = await loginWithEmail(email, password);
      if (user) {
        navigate(userData?.onboarding_completed ? "/dashboard" : "/onboarding");
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message }));
      controls.start("shake");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
      {/* --- Sunset Background & Particles --- */}
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

      {/* --- Main Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={styles.card}
      >
        <div style={styles.header}>
          <motion.h2 style={styles.title}>Welcome Back</motion.h2>
          <p style={styles.subtitle}>Sign in to continue your journey</p>
        </div>

        {/* Global Error Message */}
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

        <form onSubmit={handleLogin} style={styles.form}>
          {/* Email Field */}
          <motion.div
            animate={controls}
            variants={shakeVariants}
            style={styles.fieldWrapper}
          >
            <div style={styles.labelRow}>
              <label style={styles.label}>Email Address</label>
              {validFields.email && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={styles.validBadge}
                >
                  <CheckCircle2 size={14} color="#38A169" />
                  <span
                    style={{
                      color: "#38A169",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    Valid
                  </span>
                </motion.div>
              )}
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
                    : "#F09819"
                }
              />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                style={{
                  ...styles.input,
                  borderColor: errors.email
                    ? "#e74c3c"
                    : validFields.email
                    ? "#38A169"
                    : "rgba(0,0,0,0.1)",
                  backgroundColor: errors.email ? "#fff5f5" : "white",
                }}
                placeholder="name@example.com"
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
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                {validFields.password && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={styles.validBadge}
                  >
                    <CheckCircle2 size={14} color="#38A169" />
                    <span
                      style={{
                        color: "#38A169",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      Secure
                    </span>
                  </motion.div>
                )}
                <a href="/forgot-password" style={styles.forgotLink}>
                  Forgot?
                </a>
              </div>
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
                onChange={handlePasswordChange}
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
            {/* Live Error Message for Password */}
            {errors.password && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={styles.fieldError}
              >
                {errors.password}
              </motion.span>
            )}

            {/* Password Hint (Only show if typing and invalid) */}
            {!validFields.password &&
              password.length > 0 &&
              !errors.password && (
                <span style={styles.hintText}>
                  Must be 8+ chars, 1 uppercase, 1 lowercase
                </span>
              )}
          </motion.div>

          {/* Login Button */}
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 20px rgba(240, 152, 25, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={styles.spinner}
              />
            ) : (
              <>
                Login <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine} />
        </div>

        {/* Google Button */}
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#fafafa" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={styles.googleBtn}
        >
          <Chrome size={20} color="#EA4335" />
          <span>Sign in with Google</span>
        </motion.button>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <a href="/register" style={styles.registerLink}>
              Register here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// --- Animation Variants ---
const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};

// --- Styles ---
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
    gap: "24px",
  },
  header: {
    textAlign: "center",
  },
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
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
  validBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#F09819",
    textDecoration: "none",
    fontWeight: "600",
  },
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
    display: "flex",
    alignItems: "center",
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
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "1px",
  },
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
  footer: {
    textAlign: "center",
    marginTop: "8px",
  },
  footerText: {
    fontSize: "14px",
    color: "#718096",
  },
  registerLink: {
    color: "#FF512F",
    textDecoration: "none",
    fontWeight: "700",
  },
};
