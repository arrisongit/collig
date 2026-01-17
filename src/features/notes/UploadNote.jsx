import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { uploadNote, getCourses } from "./notes.service";
import {
  getUniversities,
  getDepartments,
  getLevels,
} from "../../services/onboarding.service";
import { uploadImage } from "../../utils/uploadImage";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
} from "lucide-react";

// --- Font Injection ---
const FontStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
      body { margin: 0; padding: 0; overflow-x: hidden; background-color: #F3F4F6; }
    `}
  </style>
);

export default function UploadNote() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Data State
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    department_id: userData?.department_id || "",
    level_id: userData?.level_id || "",
    course_id: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // --- Initial Data Load ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, deptsData, levelsData] = await Promise.all([
          getCourses(),
          getDepartments(),
          getLevels(),
        ]);
        setCourses(coursesData);
        setDepartments(deptsData);
        setLevels(levelsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (file) => {
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setErrors((prev) => ({ ...prev, file: null }));
    }
  };

  // Drag and Drop Logic
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleStandardFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.department_id)
      newErrors.department_id = "Department is required";
    if (!formData.level_id) newErrors.level_id = "Level is required";
    if (!formData.course_id) newErrors.course_id = "Course is required";
    if (!formData.file) newErrors.file = "Please upload a file";

    if (formData.file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(formData.file.type)) {
        newErrors.file = "Only PDF and images allowed";
      }
      if (formData.file.size > 10 * 1024 * 1024) {
        newErrors.file = "File size must be less than 10MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const uploadResult = await uploadImage(formData.file);
      const fileUrl = uploadResult.secure_url;

      const noteData = {
        title: formData.title,
        file_url: fileUrl,
        file_type: formData.file.type.startsWith("image/") ? "image" : "pdf",
        file_size: formData.file.size,
        uploader_id: user.uid,
        uploader_name: userData.full_name,
        university_id: userData.university_id,
        department_id: formData.department_id,
        level_id: formData.level_id,
        course_id: formData.course_id,
        status: "pending",
        created_at: new Date(),
      };

      await uploadNote(noteData);
      setSuccess(true);

      // Redirect after success animation
      setTimeout(() => {
        navigate("/notes");
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Upload failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  if (success) return <SuccessView />;

  return (
    <>
      <FontStyles />
      <div style={styles.pageContainer}>
        {/* Animated Background */}
        <div style={styles.meshBackground}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              ...styles.meshOrb,
              top: "-20%",
              left: "-10%",
              background: "#6366f1",
            }}
          />
          <motion.div
            animate={{ x: [-50, 50, -50] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{
              ...styles.meshOrb,
              bottom: "-20%",
              right: "-10%",
              background: "#10B981",
            }}
          />
          <div style={styles.glassOverlay} />
        </div>

        <div style={styles.contentContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.card}
          >
            <div style={styles.header}>
              <button
                onClick={() => navigate("/notes")}
                style={styles.closeBtn}
              >
                <X size={24} color="#6B7280" />
              </button>
              <div style={styles.headerText}>
                <h1 style={styles.title}>Upload Resource</h1>
                <p style={styles.subtitle}>Share knowledge with your campus.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* TITLE INPUT */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Resource Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Calculus 101 - Lecture 4"
                  style={{
                    ...styles.input,
                    borderColor: errors.title ? "#EF4444" : "#E5E7EB",
                  }}
                />
                {errors.title && (
                  <span style={styles.errorText}>{errors.title}</span>
                )}
              </div>

              {/* METADATA GRID */}
              <div style={styles.grid}>
                <SelectInput
                  label="Department"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  options={departments}
                  placeholder="Select Dept"
                  error={errors.department_id}
                />
                <SelectInput
                  label="Level"
                  name="level_id"
                  value={formData.level_id}
                  onChange={handleChange}
                  options={levels}
                  placeholder="Select Level"
                  error={errors.level_id}
                />
                <SelectInput
                  label="Course"
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  options={courses}
                  placeholder="Select Course"
                  error={errors.course_id}
                  fullWidth
                />
              </div>

              {/* DRAG AND DROP ZONE */}
              <div
                style={{
                  ...styles.dropZone,
                  borderColor: dragActive
                    ? "#4F46E5"
                    : errors.file
                    ? "#EF4444"
                    : "#E5E7EB",
                  backgroundColor: dragActive ? "#EEF2FF" : "#F9FAFB",
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!formData.file ? (
                  <>
                    <div style={styles.uploadIconCircle}>
                      <UploadCloud size={24} color="#4F46E5" />
                    </div>
                    <h3 style={styles.dropTitle}>
                      Click to upload or drag and drop
                    </h3>
                    <p style={styles.dropSubtitle}>PDF, PNG, JPG (max 10MB)</p>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleStandardFileSelect}
                      style={styles.hiddenInput}
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      style={styles.uploadLabelOverlay}
                    />
                  </>
                ) : (
                  <div style={styles.filePreview}>
                    <div style={styles.fileIconBox}>
                      {formData.file.type === "application/pdf" ? (
                        <FileText size={28} color="#EF4444" />
                      ) : (
                        <ImageIcon size={28} color="#3B82F6" />
                      )}
                    </div>
                    <div style={styles.fileInfo}>
                      <span style={styles.fileName}>{formData.file.name}</span>
                      <span style={styles.fileSize}>
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      style={styles.removeFileBtn}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              {errors.file && (
                <span
                  style={{
                    ...styles.errorText,
                    marginTop: "-15px",
                    marginBottom: "15px",
                  }}
                >
                  {errors.file}
                </span>
              )}
              {errors.form && (
                <div style={styles.globalError}>
                  <AlertCircle size={16} />
                  {errors.form}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                style={styles.submitBtn}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    style={styles.spinner}
                  />
                ) : (
                  <>
                    Upload Note <UploadCloud size={18} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}

// --- Sub-Components ---

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
  fullWidth,
}) => (
  <div
    style={{ ...styles.formGroup, gridColumn: fullWidth ? "span 2" : "span 1" }}
  >
    <label style={styles.label}>{label}</label>
    <div style={styles.selectWrapper}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{ ...styles.select, borderColor: error ? "#EF4444" : "#E5E7EB" }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      <ChevronDown size={16} style={styles.selectIcon} />
    </div>
    {error && <span style={styles.errorText}>{error}</span>}
  </div>
);

const SuccessView = () => (
  <div style={styles.successContainer}>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      style={styles.successIcon}
    >
      <CheckCircle2 size={64} color="white" />
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={styles.successTitle}
    >
      Upload Successful!
    </motion.h2>
    <p style={styles.successText}>Redirecting to dashboard...</p>
  </div>
);

// --- Styles ---

const styles = {
  pageContainer: {
    minHeight: "100vh",
    width: "100%",
    fontFamily: "'Montserrat', sans-serif",
    position: "relative",
    color: "#1F2937",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  meshBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "#F3F4F6",
    zIndex: 0,
  },
  meshOrb: {
    position: "absolute",
    borderRadius: "50%",
    width: "600px",
    height: "600px",
    filter: "blur(100px)",
    opacity: 0.3,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: "blur(60px)",
    background: "rgba(255,255,255,0.4)",
  },
  contentContainer: {
    position: "relative",
    zIndex: 1,
    padding: "20px",
    width: "100%",
    maxWidth: "550px",
  },

  // Card
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    border: "1px solid white",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    marginBottom: "30px",
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
    "&:hover": { backgroundColor: "#F3F4F6" },
  },
  headerText: { textAlign: "center" },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  subtitle: { fontSize: "14px", color: "#6B7280", margin: 0 },

  // Form
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  selectWrapper: { position: "relative" },
  select: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    fontSize: "15px",
    appearance: "none",
    backgroundColor: "white",
    outline: "none",
    cursor: "pointer",
  },
  selectIcon: {
    position: "absolute",
    right: "14px",
    top: "14px",
    color: "#9CA3AF",
    pointerEvents: "none",
  },
  errorText: { fontSize: "12px", color: "#EF4444", fontWeight: "500" },
  globalError: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#EF4444",
    backgroundColor: "#FEF2F2",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "13px",
  },

  // Drop Zone
  dropZone: {
    border: "2px dashed #E5E7EB",
    borderRadius: "16px",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    transition: "all 0.2s",
    position: "relative",
    backgroundColor: "#F9FAFB",
    minHeight: "180px",
    cursor: "pointer",
  },
  uploadIconCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#EEF2FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  dropTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 6px 0",
  },
  dropSubtitle: { fontSize: "13px", color: "#9CA3AF", margin: 0 },
  hiddenInput: { display: "none" },
  uploadLabelOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    cursor: "pointer",
  },

  // File Preview
  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    backgroundColor: "white",
    padding: "12px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  fileIconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    backgroundColor: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fileInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
    overflow: "hidden",
  },
  fileName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1F2937",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  fileSize: { fontSize: "12px", color: "#6B7280" },
  removeFileBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9CA3AF",
    padding: "4px",
  },

  // Submit
  submitBtn: {
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
    marginTop: "10px",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
  },

  // Success
  successContainer: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  successIcon: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#10B981",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
  },
  successTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  successText: { fontSize: "16px", color: "#6B7280" },
};
