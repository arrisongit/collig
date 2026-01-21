import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  registerWithEmail,
  checkEmailAvailability,
} from "../../services/auth.service";

export default function Register() {
  const navigate = useNavigate();
  const controls = useAnimation();

  // --- LOGIC & STATE (Preserved) ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailStatus, setEmailStatus] = useState("idle"); // idle | checking | valid | invalid

  // UI State for focus effects
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleEmailBlur = async () => {
    setFocusedField(null);
    if (!formData.email || errors.email) return;

    setEmailStatus("checking");
    const { available } = await checkEmailAvailability(formData.email);

    if (!available) {
      setErrors((prev) => ({ ...prev, email: "Email is already taken" }));
      setEmailStatus("invalid");
    } else {
      setEmailStatus("valid");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      controls.start("shake");
      return;
    }

    if (emailStatus === "invalid") {
      controls.start("shake");
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(
        formData.email,
        formData.password,
        formData.fullName,
      );
      navigate("/onboarding", { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
      controls.start("shake");
    } finally {
      setLoading(false);
    }
  };

  // --- Background Animation Data ---
  const orbs = [
    {
      id: 1,
      color: "rgba(139, 92, 246, 0.4)",
      top: "10%",
      left: "10%",
      size: "300px",
      delay: 0,
    },
    {
      id: 2,
      color: "rgba(59, 130, 246, 0.4)",
      top: "60%",
      left: "70%",
      size: "350px",
      delay: 2,
    },
  ];

  return (
    <div style={styles.pageContainer}>
      {/* Inject global styles for placeholders */}
      <style>
        {`
          input::placeholder { color: #64748b; }
          /* Remove auto-fill background in Chrome */
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus, 
          input:-webkit-autofill:active{
              -webkit-box-shadow: 0 0 0 30px #1e293b inset !important;
              -webkit-text-fill-color: white !important;
              transition: background-color 5000s ease-in-out 0s;
          }
        `}
      </style>

      {/* --- Dynamic Background --- */}
      <div style={styles.bgOverlay} />
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          style={{
            position: "absolute",
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, rgba(0,0,0,0) 70%)`,
            filter: "blur(60px)",
            zIndex: 0,
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* --- Main Card --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={styles.card}
      >
        <div style={styles.header}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            style={styles.iconBadge}
          >
            <Sparkles size={24} color="#fff" />
          </motion.div>
          <div>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Start your 14-day free trial</p>
          </div>
        </div>

        {/* Global Error */}
        <AnimatePresence>
          {errors.form && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              style={styles.globalError}
            >
              <AlertCircle size={18} style={{ minWidth: "18px" }} />
              <span>{errors.form}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Full Name Field */}
          <motion.div
            animate={controls}
            variants={shakeVariants}
            style={styles.fieldGroup}
          >
            <div
              style={{
                ...styles.inputWrapper,
                borderColor: errors.fullName
                  ? "#ef4444"
                  : focusedField === "fullName"
                    ? "#8b5cf6"
                    : "rgba(255,255,255,0.1)",
                boxShadow:
                  focusedField === "fullName"
                    ? "0 0 0 4px rgba(139, 92, 246, 0.15)"
                    : "none",
              }}
            >
              <User
                size={20}
                color={focusedField === "fullName" ? "#8b5cf6" : "#64748b"}
              />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField(null)}
                placeholder="Full Name"
                style={styles.input}
              />
            </div>
            {errors.fullName && (
              <span style={styles.errorText}>{errors.fullName}</span>
            )}
          </motion.div>

          {/* Email Field with Async Status */}
          <motion.div
            animate={controls}
            variants={shakeVariants}
            style={styles.fieldGroup}
          >
            <div
              style={{
                ...styles.inputWrapper,
                borderColor: errors.email
                  ? "#ef4444"
                  : focusedField === "email"
                    ? "#8b5cf6"
                    : "rgba(255,255,255,0.1)",
                boxShadow:
                  focusedField === "email"
                    ? "0 0 0 4px rgba(139, 92, 246, 0.15)"
                    : "none",
              }}
            >
              <Mail
                size={20}
                color={focusedField === "email" ? "#8b5cf6" : "#64748b"}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={handleEmailBlur}
                placeholder="Email Address"
                style={styles.input}
              />

              {/* Status Indicator */}
              <div style={styles.statusIndicator}>
                {emailStatus === "checking" && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <Loader2 size={18} color="#8b5cf6" />
                  </motion.div>
                )}
                {emailStatus === "valid" && !errors.email && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 size={18} color="#22c55e" />
                  </motion.div>
                )}
              </div>
            </div>
            {errors.email && (
              <span style={styles.errorText}>{errors.email}</span>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            animate={controls}
            variants={shakeVariants}
            style={styles.fieldGroup}
          >
            <div
              style={{
                ...styles.inputWrapper,
                borderColor: errors.password
                  ? "#ef4444"
                  : focusedField === "password"
                    ? "#8b5cf6"
                    : "rgba(255,255,255,0.1)",
                boxShadow:
                  focusedField === "password"
                    ? "0 0 0 4px rgba(139, 92, 246, 0.15)"
                    : "none",
              }}
            >
              <Lock
                size={20}
                color={focusedField === "password" ? "#8b5cf6" : "#64748b"}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Create Password"
                style={styles.input}
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
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </motion.div>

          {/* Terms Text */}
          <p style={styles.termsText}>
            By creating an account, you agree to our{" "}
            <span style={styles.linkText}>Terms</span> and{" "}
            <span style={styles.linkText}>Privacy Policy</span>.
          </p>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? (
              <Loader2 size={20} style={styles.spinner} />
            ) : (
              <>
                Get Started <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already a member?{" "}
            <Link to="/login" style={styles.loginLink}>
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// --- Animations ---
const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.3 },
  },
};

// --- Styles (Mobile First & Modern) ---
const styles = {
  pageContainer: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617", // Rich black/slate
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
    padding: "16px",
    boxSizing: "border-box",
  },
  bgOverlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(at top center, #1e1b4b 0%, #020617 80%)", // Deep indigo glow
    zIndex: 0,
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "rgba(15, 23, 42, 0.6)", // Glass dark
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "32px 28px",
    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "28px",
    gap: "16px",
  },
  iconBadge: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)", // Violet to Fuschia
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 16px rgba(139, 92, 246, 0.3)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: "0 0 6px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
  globalError: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#fca5a5",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)", // Darker inner bg
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "14px",
    padding: "0 14px",
    height: "54px", // Tall touch target
    transition: "all 0.2s ease",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#f1f5f9",
    fontSize: "16px", // Prevents zoom on mobile
    padding: "0 12px",
    outline: "none",
    height: "100%",
    width: "100%",
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    padding: "8px",
    cursor: "pointer",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
  },
  errorText: {
    fontSize: "12px",
    color: "#ef4444",
    marginLeft: "4px",
    fontWeight: "500",
  },
  termsText: {
    fontSize: "12px",
    color: "#64748b",
    lineHeight: "1.5",
    textAlign: "center",
    margin: "4px 0",
  },
  linkText: {
    color: "#8b5cf6",
    cursor: "pointer",
    fontWeight: "500",
  },
  submitBtn: {
    width: "100%",
    height: "54px",
    marginTop: "8px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(90deg, #7c3aed 0%, #9333ea 100%)", // Violet gradients
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
  },
  spinner: {
    animation: "spin 1s linear infinite",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  loginLink: {
    color: "#f8fafc",
    textDecoration: "none",
    fontWeight: "600",
    marginLeft: "4px",
  },
};
