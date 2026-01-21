import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  ChevronDown,
  School,
  BookOpen,
  GraduationCap,
  Library,
  Search,
  Check,
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import {
  universitiesData,
  departmentsData,
  levelsData,
  coursesData,
} from "../../config/academics";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scaleY: 0.8, transformOrigin: "top" },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function Onboarding() {
  const { user, userData, setUserData } = useAuth();
  const navigate = useNavigate();

  // --- EXISTING LOGIC (UNCHANGED) ---
  const [institutionId, setInstitutionId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [levelId, setLevelId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userData?.onboarding_completed) {
      navigate("/dashboard", { replace: true });
    }
  }, [userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!institutionId || !departmentId || !levelId || !courseId) {
      setError("Please complete all fields.");
      return;
    }

    const institution =
      universitiesData.find((u) => u.id === institutionId)?.name || "";
    const department =
      departmentsData.find((d) => d.id === departmentId)?.name || "";
    const level = levelsData.find((l) => l.id === levelId)?.name || "";
    const course = coursesData.find((c) => c.id === courseId)?.name || "";

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        institution,
        department,
        level,
        course,
        onboarding_completed: true,
      });

      setUserData((prev) => ({
        ...(prev || {}),
        institution,
        department,
        level,
        course,
        onboarding_completed: true,
      }));

      setStep("welcome");
      setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
    } catch (err) {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  // --- CUSTOM DROPDOWN COMPONENT ---
  const CustomDropdown = ({
    icon: Icon,
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
    zIndex = 10,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Synthetic event handler to match original logic signature
    const handleSelect = (id) => {
      onChange({ target: { value: id } }); // Mimic event object
      setIsOpen(false);
      setSearchTerm("");
    };

    const selectedItem = options.find((opt) => opt.id === value);

    // Filter & Categorize Options Logic
    const filteredOptions = useMemo(() => {
      return options.filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }, [options, searchTerm]);

    // Group by first letter for modern look
    const groupedOptions = useMemo(() => {
      if (filteredOptions.length < 10) return { Options: filteredOptions }; // Don't group short lists

      const groups = {};
      filteredOptions.forEach((opt) => {
        const firstLetter = opt.name[0].toUpperCase();
        if (!groups[firstLetter]) groups[firstLetter] = [];
        groups[firstLetter].push(opt);
      });
      return groups;
    }, [filteredOptions]);

    return (
      <div
        ref={dropdownRef}
        style={{ ...styles.dropdownWrapper, zIndex: isOpen ? 100 : zIndex }}
      >
        {/* Trigger Button */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          style={{
            ...styles.trigger,
            borderColor: isOpen ? "#818CF8" : "rgba(255,255,255,0.1)",
            backgroundColor: disabled
              ? "rgba(255,255,255,0.02)"
              : isOpen
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.03)",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <div style={styles.triggerContent}>
            <div
              style={{
                ...styles.iconBox,
                color: isOpen || value ? "#818CF8" : "#6B7280",
              }}
            >
              <Icon size={18} />
            </div>
            <div style={styles.triggerText}>
              <span
                style={{
                  ...styles.label,
                  color: value || isOpen ? "#818CF8" : "#9CA3AF",
                }}
              >
                {placeholder}
              </span>
              {value && (
                <span style={styles.valueText}>{selectedItem?.name}</span>
              )}
            </div>
          </div>
          <ChevronDown
            size={16}
            color="#6B7280"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={styles.menu}
            >
              {/* Search Bar */}
              <div style={styles.searchContainer}>
                <Search
                  size={14}
                  color="#6B7280"
                  style={{ position: "absolute", left: 12 }}
                />
                <input
                  autoFocus
                  type="text"
                  placeholder="Type to filter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Options List */}
              <div style={styles.listContainer}>
                {Object.keys(groupedOptions).length === 0 ? (
                  <div style={styles.noResults}>No results found</div>
                ) : (
                  Object.entries(groupedOptions).map(([group, items]) => (
                    <div key={group}>
                      {Object.keys(groupedOptions).length > 1 && (
                        <div style={styles.groupHeader}>{group}</div>
                      )}
                      {items.map((opt) => (
                        <motion.div
                          key={opt.id}
                          whileHover={{
                            backgroundColor: "rgba(99, 102, 241, 0.15)",
                          }}
                          onClick={() => handleSelect(opt.id)}
                          style={{
                            ...styles.option,
                            color: value === opt.id ? "#818CF8" : "#D4D4D8",
                            fontWeight: value === opt.id ? "600" : "400",
                          }}
                        >
                          <span>{opt.name}</span>
                          {value === opt.id && (
                            <Check size={14} color="#818CF8" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      {/* Dynamic Background */}
      <div style={styles.bgGlow} />
      <div style={styles.gridOverlay} />

      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div
            key="form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={styles.card}
          >
            <div style={styles.header}>
              <div style={styles.logo}>
                <Library size={28} color="white" />
              </div>
              <h2 style={styles.title}>Academic Setup</h2>
              <p style={styles.subtitle}>
                Help us personalize your experience.
              </p>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.formStack}>
              <CustomDropdown
                zIndex={40}
                icon={School}
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                options={universitiesData}
                placeholder="Institution"
              />

              <CustomDropdown
                zIndex={30}
                icon={BookOpen}
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                options={departmentsData}
                placeholder="Department"
              />

              <div style={styles.row}>
                <div style={{ flex: 1 }}>
                  <CustomDropdown
                    zIndex={20}
                    icon={GraduationCap}
                    value={levelId}
                    onChange={(e) => setLevelId(e.target.value)}
                    options={levelsData}
                    placeholder="Level"
                  />
                </div>
              </div>

              <CustomDropdown
                zIndex={10}
                icon={Library}
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                options={coursesData.filter(
                  (c) => c.department_id === departmentId,
                )}
                placeholder={
                  departmentId ? "Select Course" : "Choose department first..."
                }
                disabled={!departmentId}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                style={styles.submitBtn}
              >
                {loading ? (
                  <Loader2 className="spin" size={20} />
                ) : (
                  "Complete Profile"
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.successWrapper}
          >
            <div style={styles.successIcon}>
              <CheckCircle2 size={50} color="#10B981" />
            </div>
            <h1 style={styles.successTitle}>You're In!</h1>
            <p style={styles.successText}>Redirecting to dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

// --- STYLES OBJECT ---
const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgGlow: {
    position: "absolute",
    top: "-20%",
    left: "-20%",
    width: "70vw",
    height: "70vw",
    background:
      "radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 60%)",
    filter: "blur(80px)",
    zIndex: 0,
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    opacity: 0.5,
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "rgba(20, 20, 23, 0.7)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
  },
  header: { textAlign: "center", marginBottom: "30px" },
  logo: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
  },
  title: { fontSize: "22px", fontWeight: "700", margin: "0 0 6px" },
  subtitle: { fontSize: "14px", color: "#A1A1AA", margin: 0 },
  error: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#FCA5A5",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "13px",
    textAlign: "center",
  },
  formStack: { display: "flex", flexDirection: "column", gap: "16px" },
  row: { display: "flex", gap: "12px" },

  // Dropdown Styles
  dropdownWrapper: { position: "relative" },
  trigger: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid",
    transition: "all 0.2s ease",
  },
  triggerContent: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    overflow: "hidden",
  },
  triggerText: { display: "flex", flexDirection: "column", overflow: "hidden" },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "color 0.2s",
  },
  valueText: {
    fontSize: "14px",
    color: "#fff",
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  menu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    width: "100%",
    maxHeight: "280px",
    backgroundColor: "#18181B",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  searchContainer: {
    position: "relative",
    padding: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "13px",
    paddingLeft: "24px",
    outline: "none",
  },
  listContainer: {
    overflowY: "auto",
    padding: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  groupHeader: {
    padding: "8px 12px 4px",
    fontSize: "11px",
    color: "#6366F1",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  option: {
    padding: "10px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "background 0.2s",
  },
  noResults: {
    padding: "20px",
    textAlign: "center",
    color: "#71717A",
    fontSize: "13px",
  },

  submitBtn: {
    marginTop: "8px",
    padding: "16px",
    borderRadius: "14px",
    background: "#4F46E5",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(79, 70, 229, 0.4)",
  },

  // Success
  successWrapper: {
    textAlign: "center",
    zIndex: 20,
  },
  successIcon: {
    marginBottom: "20px",
    display: "inline-flex",
    padding: "20px",
    borderRadius: "50%",
    background: "rgba(16, 185, 129, 0.1)",
    boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)",
  },
  successTitle: { fontSize: "28px", margin: "0 0 10px" },
  successText: { color: "#A1A1AA" },
};
