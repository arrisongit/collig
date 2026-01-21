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
  Sparkles,
  Zap,
} from "lucide-react";
import { loginWithEmail, signInWithGoogle } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { user, userData, loading: authLoading } = useAuth();

  // Logic State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // UI States
  const [globalError, setGlobalError] = useState(""); // Server errors
  const [fieldErrors, setFieldErrors] = useState({}); // Validation errors
  const [focusedField, setFocusedField] = useState(null); // For UI highlighting

  const [validFields, setValidFields] = useState({
    email: false,
    password: false,
  });

  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userData) {
      redirectByRole(userData);
    }
  }, [loading, userData]);

  const redirectByRole = (data) => {
    navigate("/dashboard", { replace: true });
  };

  // --- Live Validation Logic ---
  const validateField = (name, value) => {
    let errorMsg = "";
    let isValid = false;

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) errorMsg = "Email is required";
      else if (!emailRegex.test(value)) errorMsg = "Invalid email format";
      else isValid = true;
    }

    if (name === "password") {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const isLongEnough = value.length >= 8;

      if (!value) errorMsg = "Password is required";
      else if (!isLongEnough) errorMsg = "Min 8 characters required";
      else if (!hasUpperCase) errorMsg = "Need 1 uppercase letter";
      else if (!hasLowerCase) errorMsg = "Need 1 lowercase letter";
      else isValid = true;
    }

    setFieldErrors((prev) => ({ ...prev, [name]: isValid ? "" : errorMsg }));
    setValidFields((prev) => ({ ...prev, [name]: isValid }));

    return isValid;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    validateField("email", val);
    if (globalError) setGlobalError("");
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    validateField("password", val);
    if (globalError) setGlobalError("");
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setGlobalError("");

    // Quick pre-check
    const isEmailValid = validateField("email", email);
    const isPassValid = validateField("password", password);

    if (!isEmailValid || !isPassValid) {
      controls.start("shake");
      return;
    }

    setLoading(true);
    try {
      const { userData } = await loginWithEmail(email, password);
      redirectByRole(userData);
    } catch (err) {
      setGlobalError(
        err.message || "Failed to login. Please check your credentials.",
      );
      controls.start("shake");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGlobalError("");
    try {
      const { userData } = await signInWithGoogle();
      redirectByRole(userData);
    } catch (err) {
      setGlobalError(err.message);
    }
  };

  // --- Background Elements ---
  const [orbs, setOrbs] = useState([]);
  useEffect(() => {
    // Generate fewer, larger, smoother orbs for a modern look
    setOrbs(
      [...Array(4)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: Math.random() * 0.5 + 0.8,
        duration: Math.random() * 10 + 20,
      })),
    );
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* --- Dynamic Background --- */}
      <div style={styles.bgOverlay} />

      {/* Animated Orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          style={{
            ...styles.orb,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background:
              orb.id % 2 === 0
                ? "radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(0,0,0,0) 70%)",
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* --- Main Card --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        style={styles.card}
      >
        {/* Header Section */}
        <div style={styles.header}>
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={styles.iconBadge}
          >
            <Zap size={24} color="#fff" fill="currentColor" />
          </motion.div>
          <div style={styles.headerText}>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={styles.title}
            >
              Welcome Back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={styles.subtitle}
            >
              Enter your details to access your workspace.
            </motion.p>
          </div>
        </div>

        {/* Global Error Banner */}
        <AnimatePresence mode="wait">
          {globalError && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              style={styles.errorBanner}
            >
              <AlertCircle size={18} />
              <span>{globalError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleEmailLogin} style={styles.form}>
          {/* Email Field */}
          <motion.div
            animate={controls}
            variants={shakeVariants}
            style={styles.inputGroup}
          >
            <label style={styles.label}>
              Email
              {validFields.email && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={styles.validText}
                >
                  <CheckCircle2 size={12} /> Valid
                </motion.span>
              )}
            </label>
            <div
              style={{
                ...styles.inputWrapper,
                borderColor: fieldErrors.email
                  ? "#ef4444"
                  : focusedField === "email"
                    ? "#8b5cf6"
                    : "rgba(255,255,255,0.1)",
                boxShadow:
                  focusedField === "email"
                    ? "0 0 0 4px rgba(139, 92, 246, 0.1)"
                    : "none",
              }}
            >
              <Mail
                size={20}
                color={
                  fieldErrors.email
                    ? "#ef4444"
                    : focusedField === "email"
                      ? "#8b5cf6"
                      : "#94a3b8"
                }
              />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                style={styles.input}
                placeholder="name@company.com"
              />
            </div>
            <AnimatePresence>
              {fieldErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={styles.fieldErrorText}
                >
                  {fieldErrors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password Field */}
          <motion.div
            animate={controls}
            variants={shakeVariants}
            style={styles.inputGroup}
          >
            <div style={styles.labelRow}>
              <label style={styles.label}>Password</label>
              <a href="/forgot-password" style={styles.forgotLink}>
                Forgot?
              </a>
            </div>

            <div
              style={{
                ...styles.inputWrapper,
                borderColor: fieldErrors.password
                  ? "#ef4444"
                  : focusedField === "password"
                    ? "#8b5cf6"
                    : "rgba(255,255,255,0.1)",
                boxShadow:
                  focusedField === "password"
                    ? "0 0 0 4px rgba(139, 92, 246, 0.1)"
                    : "none",
              }}
            >
              <Lock
                size={20}
                color={
                  fieldErrors.password
                    ? "#ef4444"
                    : focusedField === "password"
                      ? "#8b5cf6"
                      : "#94a3b8"
                }
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                style={styles.input}
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

            {/* Password Validation Hints */}
            <div style={styles.hintsContainer}>
              <AnimatePresence mode="wait">
                {fieldErrors.password ? (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.fieldErrorText}
                  >
                    {fieldErrors.password}
                  </motion.p>
                ) : validFields.password ? (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={styles.successText}
                  >
                    <Sparkles size={12} /> Strong password
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
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
                Sign In <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div style={styles.divider}>
          <div style={styles.line} />
          <span style={styles.orText}>OR CONTINUE WITH</span>
          <div style={styles.line} />
        </div>

        {/* Social Login */}
        <motion.button
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          disabled={loading}
          style={styles.googleBtn}
        >
          <Chrome size={20} color="#fff" />
          <span>Google</span>
        </motion.button>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            New here?{" "}
            <a href="/register" style={styles.registerLink}>
              Create an account
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
    transition: { duration: 0.3 },
  },
};

// --- Modern Glassmorphism Styles (Mobile First) ---
const styles = {
  pageContainer: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#030712", // Very dark slate
    overflow: "hidden",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  bgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `
      radial-gradient(at 0% 0%, rgba(17, 24, 39, 1) 0, transparent 50%), 
      radial-gradient(at 50% 0%, rgba(88, 28, 135, 0.15) 0, transparent 50%), 
      radial-gradient(at 100% 0%, rgba(17, 24, 39, 1) 0, transparent 50%)
    `,
    zIndex: 0,
  },
  orb: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(60px)",
    opacity: 0.6,
    width: "40vw",
    height: "40vw",
    zIndex: 0,
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "rgba(17, 24, 39, 0.7)", // Dark transparent
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "40px 32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "16px",
  },
  iconBadge: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 20px rgba(124, 58, 237, 0.3)",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
    lineHeight: "1.5",
  },
  errorBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#fca5a5",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    overflow: "hidden",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#cbd5e1",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  validText: {
    color: "#4ade80",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    padding: "2px 6px",
    borderRadius: "99px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "12px",
    padding: "0 14px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    height: "52px",
  },
  input: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "15px",
    padding: "0 12px",
    outline: "none",
    height: "100%",
  },
  eyeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    padding: "4px",
    transition: "color 0.2s",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#8b5cf6",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  hintsContainer: {
    minHeight: "20px", // prevent layout jump
  },
  fieldErrorText: {
    fontSize: "12px",
    color: "#ef4444",
    margin: "4px 0 0 0",
    fontWeight: "500",
  },
  successText: {
    fontSize: "12px",
    color: "#4ade80",
    margin: "4px 0 0 0",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  submitBtn: {
    width: "100%",
    height: "52px",
    marginTop: "8px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)", // Indigo to Violet
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)",
    transition: "all 0.2s",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255,255,255,0.2)",
    borderTopColor: "white",
    borderRadius: "50%",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "4px 0",
  },
  line: {
    flex: 1,
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  orText: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: "1px",
  },
  googleBtn: {
    width: "100%",
    height: "48px",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    transition: "background-color 0.2s",
  },
  footer: {
    textAlign: "center",
    marginTop: "8px",
  },
  footerText: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  registerLink: {
    color: "#8b5cf6", // Violet 500
    textDecoration: "none",
    fontWeight: "600",
    marginLeft: "4px",
  },
};
