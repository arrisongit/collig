import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  BookOpen,
  Calendar,
  Users,
  Building2,
  ShieldCheck,
  ChevronRight,
  Bell,
  X,
  Home,
  User,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

// --- Font Injection ---
const FontStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
      body { margin: 0; padding: 0; overflow-x: hidden; background-color: #F3F4F6; }
      ::-webkit-scrollbar { width: 0px; background: transparent; }
    `}
  </style>
);

export default function AdminDashboard() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Welcome");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);

  // Admin stats
  const [stats, setStats] = useState({
    pendingNotes: 0,
    pendingEvents: 0,
    totalUsers: 0,
    approvedSchools: 0,
  });

  // Time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Mock stats loading (in real app, fetch from services)
  useEffect(() => {
    // Simulate loading stats
    setStats({
      pendingNotes: 5,
      pendingEvents: 3,
      totalUsers: 1247,
      approvedSchools: 15,
    });
  }, []);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user || !userData) return <LoadingScreen />;

  return (
    <>
      <FontStyles />
      <div style={styles.pageContainer}>
        {/* --- DYNAMIC MESH BACKGROUND --- */}
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
            animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{
              ...styles.meshOrb,
              top: "40%",
              right: "-20%",
              background: "#ec4899",
            }}
          />
          <motion.div
            animate={{ x: [-50, 50, -50] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{
              ...styles.meshOrb,
              bottom: "-20%",
              left: "20%",
              background: "#06b6d4",
            }}
          />
          <div style={styles.glassOverlay} />
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div
          style={{
            ...styles.contentContainer,
            filter: showLogoutModal ? "blur(8px)" : "none",
          }}
        >
          {/* HEADER */}
          <header style={styles.header}>
            <div style={styles.headerProfile}>
              <div style={styles.avatar}>
                {userData.full_name?.charAt(0) || "A"}
              </div>
              <div style={styles.headerText}>
                <span style={styles.greeting}>{greeting}</span>
                <h1 style={styles.userName}>
                  {userData.full_name?.split(" ")[0]} (Admin)
                </h1>
              </div>
            </div>
          </header>
          {/* STATS CARDS */}
          <div style={styles.statsGrid}>
            <StatCard
              title="Pending Notes"
              value={stats.pendingNotes}
              icon={<BookOpen size={24} color="white" />}
              color="#8B5CF6"
              onClick={() => navigate("/admin/notes")}
            />
            <StatCard
              title="Pending Events"
              value={stats.pendingEvents}
              icon={<Calendar size={24} color="white" />}
              color="#EC4899"
              onClick={() => navigate("/admin/events")}
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<Users size={24} color="white" />}
              color="#10B981"
              onClick={() => navigate("/admin/users")}
            />
            <StatCard
              title="Approved Schools"
              value={stats.approvedSchools}
              icon={<Building2 size={24} color="white" />}
              color="#3B82F6"
              onClick={() => navigate("/admin/schools")}
            />
          </div>
          {/* ACTION TILES */}
          <div style={styles.bentoGrid}>
            <BentoTile
              title="Manage Notes"
              subtitle="Review & approve student uploads"
              icon={<BookOpen size={22} color="white" />}
              color="#8B5CF6"
              delay={0.2}
              onClick={() => navigate("/admin/notes")}
            />
            <BentoTile
              title="Manage Events"
              subtitle="Approve campus events"
              icon={<Calendar size={22} color="white" />}
              color="#EC4899"
              delay={0.3}
              onClick={() => navigate("/admin/events")}
            />
            <BentoTile
              title="User Management"
              subtitle="View & manage users"
              icon={<Users size={22} color="white" />}
              color="#10B981"
              delay={0.4}
              onClick={() => navigate("/admin/users")}
            />
            <BentoTile
              title="School Management"
              subtitle="Create & approve schools"
              icon={<Building2 size={22} color="white" />}
              color="#3B82F6"
              delay={0.5}
              onClick={() => navigate("/admin/schools")}
            />
          </div>
          <div style={{ height: "100px" }} /> {/* Spacer for dock */}
        </div>

        {/* --- FLOATING DOCK NAVIGATION --- */}
        <FloatingDock
          onLogout={() => setShowLogoutModal(true)}
          onUserProfile={() => setShowUserProfileModal(true)}
        />

        {/* --- LOGOUT MODAL --- */}
        <AnimatePresence>
          {showLogoutModal && (
            <LogoutModal
              onClose={() => setShowLogoutModal(false)}
              onConfirm={handleLogoutConfirm}
            />
          )}
          {showUserProfileModal && (
            <UserProfileModal
              onClose={() => setShowUserProfileModal(false)}
              userData={userData}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, icon, color, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    style={styles.statCard}
  >
    <div style={{ ...styles.statIcon, backgroundColor: color }}>{icon}</div>
    <div style={styles.statContent}>
      <h3 style={styles.statValue}>{value}</h3>
      <p style={styles.statTitle}>{title}</p>
    </div>
  </motion.div>
);

const BentoTile = ({ title, subtitle, icon, color, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={styles.bentoTile}
  >
    <div style={{ ...styles.tileIcon, backgroundColor: color }}>{icon}</div>
    <div style={styles.tileText}>
      <span style={styles.tileTitle}>{title}</span>
      <span style={styles.tileSubtitle}>{subtitle}</span>
    </div>
  </motion.button>
);

const FloatingDock = ({ onLogout, onUserProfile }) => (
  <motion.div
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    style={styles.dockContainer}
  >
    <div style={styles.dock}>
      <DockItem icon={<Home size={22} />} active />
      <div style={styles.dockDivider} />
      <DockItem icon={<User size={22} />} onClick={onUserProfile} />
      <DockItem
        icon={<LogOut size={22} color="#EF4444" />}
        onClick={onLogout}
      />
    </div>
  </motion.div>
);

const DockItem = ({ icon, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{ ...styles.dockItem, color: active ? "#6366f1" : "#9CA3AF" }}
  >
    {icon}
    {active && (
      <motion.div layoutId="dockActive" style={styles.dockActiveDot} />
    )}
  </motion.button>
);

const LogoutModal = ({ onClose, onConfirm }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={styles.modalOverlay}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 20, opacity: 0 }}
      style={styles.modalCard}
    >
      <button onClick={onClose} style={styles.closeModalBtn}>
        <X size={20} />
      </button>
      <SadGhost />
      <h3 style={styles.modalTitle}>Ending Session?</h3>
      <p style={styles.modalText}>
        You are about to log out. All unsaved progress will be lost.
      </p>
      <div style={styles.modalGrid}>
        <button onClick={onClose} style={styles.cancelBtn}>
          Cancel
        </button>
        <button onClick={onConfirm} style={styles.confirmBtn}>
          Logout
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const UserProfileModal = ({ onClose, userData }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={styles.profileModalOverlay}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 20, opacity: 0 }}
      style={styles.profileModalCard}
    >
      <button onClick={onClose} style={styles.closeModalBtn}>
        <X size={20} />
      </button>

      <div style={styles.profileHeader}>
        <div style={styles.profileAvatar}>
          {userData?.full_name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div style={styles.profileInfo}>
          <h2 style={styles.profileName}>
            {userData?.full_name || "Admin User"}
          </h2>
          <p style={styles.profileEmail}>{userData?.email || ""}</p>
          <p style={styles.profileRole}>
            {userData?.role === "super_admin" ? "Super Admin" : "Admin"}
          </p>
        </div>
      </div>

      <div style={styles.profileDetails}>
        <div style={styles.detailSection}>
          <h3 style={styles.sectionTitle}>Admin Actions</h3>
          <div style={styles.settingsGrid}>
            <button style={styles.settingButton}>
              <ShieldCheck size={18} />
              <span>View Permissions</span>
            </button>
            <button style={styles.settingButton}>
              <Bell size={18} />
              <span>Admin Notifications</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const LoadingScreen = () => (
  <div style={styles.loadingContainer}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={styles.loadingSpinner}
    />
    <p style={styles.loadingText}>Loading Admin Dashboard...</p>
  </div>
);

const SadGhost = () => (
  <div style={styles.ghostContainer}>
    <div style={styles.ghost}>
      <div style={styles.ghostEyes}>
        <div style={styles.eye} />
        <div style={styles.eye} />
      </div>
      <div style={styles.ghostMouth} />
    </div>
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
    paddingBottom: "80px",
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
    maxWidth: "900px",
    margin: "0 auto",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },
  headerProfile: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#6366f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "24px",
    fontWeight: "700",
  },
  headerText: { textAlign: "left" },
  greeting: {
    fontSize: "14px",
    color: "#6B7280",
    fontWeight: "500",
  },
  userName: {
    fontSize: "28px",
    fontWeight: "800",
    margin: "4px 0 0 0",
    color: "#111827",
  },

  // Stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    cursor: "pointer",
  },
  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statContent: { flex: 1 },
  statValue: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 4px 0",
    color: "#111827",
  },
  statTitle: {
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
    fontWeight: "500",
  },

  // Bento Grid
  bentoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  bentoTile: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  tileIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tileText: { flex: 1 },
  tileTitle: {
    display: "block",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    color: "#111827",
  },
  tileSubtitle: {
    display: "block",
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
  },

  // Dock
  dockContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: "16px",
  },
  dock: {
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
    margin: "0 auto",
    maxWidth: "300px",
  },
  dockDivider: {
    width: "1px",
    height: "24px",
    backgroundColor: "#E5E7EB",
  },
  dockItem: {
    background: "none",
    border: "none",
    padding: "8px",
    borderRadius: "12px",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dockActiveDot: {
    position: "absolute",
    bottom: "2px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: "#6366f1",
  },

  // Modals
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modalCard: {
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "32px",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
    position: "relative",
  },
  closeModalBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6B7280",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "800",
    margin: "16px 0 8px 0",
    color: "#111827",
  },
  modalText: {
    fontSize: "16px",
    color: "#6B7280",
    margin: "0 0 24px 0",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  cancelBtn: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
  confirmBtn: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#EF4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  // Profile Modal
  profileModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  profileModalCard: {
    backgroundColor: "white",
    borderRadius: "24px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflow: "hidden",
    position: "relative",
  },
  profileHeader: {
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    borderBottom: "1px solid #E5E7EB",
  },
  profileAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#6366f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "24px",
    fontWeight: "700",
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    color: "#111827",
  },
  profileEmail: {
    fontSize: "14px",
    color: "#6B7280",
    margin: "0 0 4px 0",
  },
  profileRole: {
    fontSize: "12px",
    color: "#F59E0B",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  profileDetails: {
    padding: "24px",
    overflow: "auto",
  },
  detailSection: { marginBottom: "24px" },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 12px 0",
    color: "#111827",
  },
  settingsGrid: {
    display: "grid",
    gap: "8px",
  },
  settingButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },

  // Loading
  loadingContainer: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #E5E7EB",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    marginBottom: "16px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#6B7280",
  },

  // Ghost
  ghostContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },
  ghost: {
    width: "60px",
    height: "60px",
    backgroundColor: "#F3F4F6",
    borderRadius: "30px 30px 0 0",
    position: "relative",
  },
  ghostEyes: {
    display: "flex",
    justifyContent: "space-around",
    position: "absolute",
    top: "15px",
    left: "10px",
    right: "10px",
  },
  eye: {
    width: "8px",
    height: "12px",
    backgroundColor: "#6B7280",
    borderRadius: "50%",
  },
  ghostMouth: {
    width: "20px",
    height: "10px",
    backgroundColor: "#6B7280",
    borderRadius: "0 0 10px 10px",
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
  },
};
