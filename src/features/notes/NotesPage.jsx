import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchNotesByCourse,
  getCourses,
  downloadNote,
  rateNote,
  getNoteRatings,
  reportNote,
} from "./notes.service";
import { getDepartments, getLevels } from "../../services/onboarding.service";
import {
  Search,
  Filter,
  Download,
  Star,
  Flag,
  FileText,
  UploadCloud,
  ChevronDown,
  X,
  BookOpen,
} from "lucide-react";

// --- Font Injection ---
const FontStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
      body { margin: 0; padding: 0; overflow-x: hidden; background-color: #F3F4F6; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
    `}
  </style>
);

export default function NotesPage() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  // Data State
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  const [ratings, setRatings] = useState({});

  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    department_id: "",
    level_id: "",
    course_id: "",
  });

  // --- Initial Data Load ---
  useEffect(() => {
    const loadFilters = async () => {
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
        console.error("Error loading filters:", error);
      }
    };
    loadFilters();
  }, []);

  // --- Fetch Notes ---
  const loadNotes = async () => {
    // If no course selected, maybe show recent or empty
    if (!selectedFilters.course_id || !userData?.university_id) {
      setNotes([]);
      return;
    }

    setLoading(true);
    try {
      const fetchedNotes = await fetchNotesByCourse(
        selectedFilters.course_id,
        userData.university_id
      );
      setNotes(fetchedNotes);

      // Load ratings
      const ratingsData = {};
      for (const note of fetchedNotes) {
        ratingsData[note.id] = await getNoteRatings(note.id);
      }
      setRatings(ratingsData);
    } catch (err) {
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [selectedFilters.course_id, userData?.university_id]);

  // --- Handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownload = async (noteId, fileUrl) => {
    try {
      await downloadNote(noteId);
      window.open(fileUrl, "_blank");
    } catch (error) {
      alert("Download failed. Please try again.");
    }
  };

  const handleRate = async (noteId, rating) => {
    try {
      await rateNote(noteId, rating);
      const updatedRatings = await getNoteRatings(noteId);
      setRatings((prev) => ({ ...prev, [noteId]: updatedRatings }));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReport = async (noteId) => {
    const reason = prompt("Why are you reporting this note?");
    if (reason) {
      try {
        await reportNote(noteId, reason);
        alert("Report submitted.");
      } catch (error) {
        alert("Report failed.");
      }
    }
  };

  // Filter notes locally by search query
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              background: "#ec4899",
            }}
          />
          <div style={styles.glassOverlay} />
        </div>

        <div style={styles.contentContainer}>
          {/* --- HEADER --- */}
          <header style={styles.header}>
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={styles.breadcrumb}
              >
                <Link to="/dashboard" style={styles.backLink}>
                  Dashboard
                </Link>
                <span style={{ margin: "0 8px" }}>/</span>
                <span>Notes</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={styles.title}
              >
                Study Resources
              </motion.h1>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/notes/upload")}
              style={styles.uploadBtn}
            >
              <UploadCloud size={18} />
              <span>Upload</span>
            </motion.button>
          </header>

          {/* --- SEARCH & FILTER BAR --- */}
          <div style={styles.controlBar}>
            <div style={styles.searchWrapper}>
              <Search
                size={20}
                color="#9CA3AF"
                style={{ position: "absolute", left: "16px" }}
              />
              <input
                type="text"
                placeholder="Search notes by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                ...styles.filterToggleBtn,
                backgroundColor: showFilters ? "#E0E7FF" : "white",
                color: showFilters ? "#4F46E5" : "#374151",
              }}
            >
              <Filter size={18} />
              <span>Filters</span>
              {showFilters ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronDown
                  size={16}
                  style={{ transform: "rotate(-90deg)" }}
                />
              )}
            </motion.button>
          </div>

          {/* --- COLLAPSIBLE FILTERS --- */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={styles.filterPanel}
              >
                <div style={styles.filterGrid}>
                  <FilterSelect
                    name="department_id"
                    value={selectedFilters.department_id}
                    onChange={handleFilterChange}
                    options={departments}
                    placeholder="All Departments"
                  />
                  <FilterSelect
                    name="level_id"
                    value={selectedFilters.level_id}
                    onChange={handleFilterChange}
                    options={levels}
                    placeholder="All Levels"
                  />
                  <FilterSelect
                    name="course_id"
                    value={selectedFilters.course_id}
                    onChange={handleFilterChange}
                    options={courses}
                    placeholder="Select Course (Required)"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- NOTES GRID --- */}
          {loading ? (
            <LoadingState />
          ) : !selectedFilters.course_id ? (
            <EmptyState
              icon={<BookOpen size={48} />}
              title="Select a Course"
              text="Please use the filters to select a course to view notes."
            />
          ) : filteredNotes.length === 0 ? (
            <EmptyState
              icon={<FileText size={48} />}
              title="No Notes Found"
              text="Be the first to upload a note for this course!"
            />
          ) : (
            <div style={styles.grid}>
              {filteredNotes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  ratingData={ratings[note.id]}
                  onDownload={handleDownload}
                  onRate={handleRate}
                  onReport={handleReport}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// --- SUB-COMPONENTS ---

const NoteCard = ({
  note,
  ratingData,
  onDownload,
  onRate,
  onReport,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={styles.noteCard}
    >
      <div style={styles.cardHeader}>
        <div style={styles.iconBox}>
          <FileText size={24} color="#4F46E5" />
        </div>
        <button
          onClick={() => onReport(note.id)}
          style={styles.reportBtn}
          title="Report"
        >
          <Flag size={14} />
        </button>
      </div>

      <h3 style={styles.noteTitle}>{note.title}</h3>
      <p style={styles.noteUploader}>By {note.uploader_name || "Anonymous"}</p>

      <div style={styles.statsRow}>
        <div style={styles.statItem}>
          <Download size={14} />
          <span>{note.download_count}</span>
        </div>
        <div style={styles.statItem}>
          <Star
            size={14}
            fill={ratingData?.average > 0 ? "#FBBF24" : "none"}
            color="#FBBF24"
          />
          <span>
            {ratingData?.average || "0.0"} ({ratingData?.count || 0})
          </span>
        </div>
      </div>

      {/* Hover Overlay for Actions */}
      <div style={styles.cardActions}>
        <button
          onClick={() => onDownload(note.id, note.file_url)}
          style={styles.downloadBtn}
        >
          Download PDF
        </button>

        <div style={styles.ratingBox}>
          <span style={{ fontSize: "11px", color: "#6B7280" }}>Rate:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.2 }}
              onClick={() => onRate(note.id, star)}
              style={styles.starBtn}
            >
              <Star
                size={16}
                fill="#FBBF24"
                color="#FBBF24"
                style={{ opacity: 0.5 }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const FilterSelect = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
}) => (
  <div style={styles.selectWrapper}>
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{
        ...styles.select,
        borderColor: required && !value ? "#FCA5A5" : "#E5E7EB",
      }}
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
);

const EmptyState = ({ icon, title, text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    style={styles.emptyState}
  >
    <div style={styles.emptyIcon}>{icon}</div>
    <h3 style={styles.emptyTitle}>{title}</h3>
    <p style={styles.emptyText}>{text}</p>
  </motion.div>
);

const LoadingState = () => (
  <div style={styles.loadingContainer}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
      style={styles.spinner}
    />
    <p style={{ marginTop: "15px", color: "#6B7280", fontSize: "14px" }}>
      Fetching resources...
    </p>
  </div>
);

// --- STYLES ---

const styles = {
  pageContainer: {
    minHeight: "100vh",
    width: "100%",
    fontFamily: "'Montserrat', sans-serif",
    position: "relative",
    color: "#1F2937",
    paddingBottom: "40px",
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
    padding: "24px",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "30px",
  },
  breadcrumb: {
    fontSize: "13px",
    color: "#6B7280",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
  },
  backLink: { textDecoration: "none", color: "#6B7280", fontWeight: "600" },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827",
    margin: 0,
    lineHeight: "1",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
  },

  // Control Bar
  controlBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  searchWrapper: {
    position: "relative",
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    borderRadius: "14px",
    border: "1px solid #E5E7EB",
    backgroundColor: "white",
    fontSize: "15px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    outline: "none",
    transition: "box-shadow 0.2s",
  },
  filterToggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 20px",
    borderRadius: "14px",
    border: "1px solid #E5E7EB",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // Filter Panel
  filterPanel: { overflow: "hidden", marginBottom: "20px" },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #E5E7EB",
  },
  selectWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  select: {
    width: "100%",
    appearance: "none",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#F9FAFB",
    fontSize: "14px",
    color: "#374151",
    outline: "none",
    cursor: "pointer",
  },
  selectIcon: {
    position: "absolute",
    right: "14px",
    pointerEvents: "none",
    color: "#9CA3AF",
  },

  // Grid & Cards
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  noteCard: {
    backgroundColor: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid white",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "transform 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    backgroundColor: "#EEF2FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  reportBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9CA3AF",
    padding: "4px",
    "&:hover": { color: "#EF4444" },
  },
  noteTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1F2937",
    margin: 0,
    lineHeight: "1.4",
  },
  noteUploader: { fontSize: "12px", color: "#6B7280", margin: 0 },
  statsRow: {
    display: "flex",
    gap: "16px",
    marginTop: "auto",
    borderTop: "1px solid #F3F4F6",
    paddingTop: "12px",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#6B7280",
    fontWeight: "500",
  },

  cardActions: {
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  downloadBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#10B981",
    color: "white",
    border: "none",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)",
  },
  ratingBox: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    justifyContent: "center",
  },
  starBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "2px",
  },

  // States
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: "24px",
    border: "2px dashed #E5E7EB",
  },
  emptyIcon: { color: "#9CA3AF", marginBottom: "16px" },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#374151",
    margin: "0 0 8px 0",
  },
  emptyText: { fontSize: "14px", color: "#6B7280", margin: 0 },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #E5E7EB",
    borderTopColor: "#4F46E5",
    borderRadius: "50%",
  },
};
