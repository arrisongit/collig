// src\features\profile\Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  BookOpen,
  Calendar,
  UploadCloud,
  Search,
  ShieldAlert,
  ChevronRight,
  Bell,
  X,
  Home,
  User,
  Settings,
  MoreHorizontal,
  TextAlignCenter,
} from "lucide-react";
import { denormalizeUserProfile } from "../../services/onboarding.service";

// --- Font Injection ---
const FontStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
      body { margin: 0; padding: 0; overflow-x: hidden; background-color: #F3F4F6; }
      
      /* Hide scrollbar for clean UI */
      ::-webkit-scrollbar { width: 0px; background: transparent; }
    `}
  </style>
);

export default function Dashboard() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [greeting, setGreeting] = useState("Welcome");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);

  // Profile screens
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPrivacySecurity, setShowPrivacySecurity] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [showHelpFAQ, setShowHelpFAQ] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);

  // Form data states
  const [editProfileData, setEditProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    eventReminders: true,
    newNotes: true,
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    dataSharing: false,
    twoFactorAuth: false,
  });
  const [appSettings, setAppSettings] = useState({
    theme: "light",
    language: "english",
    fontSize: "medium",
    autoSync: true,
  });
  const [contactForm, setContactForm] = useState({
    subject: "general",
    message: "",
  });

  // Loading and status states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Dynamic data
  const [denormalizedProfile, setDenormalizedProfile] = useState({});

  // Time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Denormalize user profile data
  useEffect(() => {
    if (userData) {
      const denormalized = denormalizeUserProfile(userData);
      setDenormalizedProfile(denormalized);

      // Initialize form data with current user data
      setEditProfileData({
        full_name: denormalized.full_name || userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
      });
    }
  }, [userData]);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleUniversityClick = () => {
    if (!denormalizedProfile.university?.id) return;

    navigate("/explore", {
      state: {
        universityId: denormalizedProfile.university.id,
        universityName: denormalizedProfile.university.name,
      },
    });
  };

  // Form handlers
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form
      if (!editProfileData.full_name.trim()) {
        throw new Error("Full name is required");
      }
      if (!editProfileData.email.trim()) {
        throw new Error("Email is required");
      }

      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user data (in real app, this would be an API call)
      console.log("Updating profile:", editProfileData);

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setShowEditProfile(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (setting, value) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleNotificationSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving notification settings:", notificationSettings);

      setSuccess("Notification preferences saved!");
      setTimeout(() => {
        setShowNotifications(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError("Failed to save notification settings");
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handlePrivacySubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving privacy settings:", privacySettings);

      setSuccess("Privacy settings saved!");
      setTimeout(() => {
        setShowPrivacySecurity(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError("Failed to save privacy settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAppSettingsChange = (setting, value) => {
    setAppSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleAppSettingsSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving app settings:", appSettings);

      setSuccess("App settings saved!");
      setTimeout(() => {
        setShowAppSettings(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError("Failed to save app settings");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!contactForm.message.trim()) {
        throw new Error("Message is required");
      }

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Sending support message:", contactForm);

      setSuccess("Message sent successfully! We'll get back to you soon.");
      setContactForm({ subject: "general", message: "" });
      setTimeout(() => {
        setShowContactSupport(false);
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userData) return <LoadingScreen />;

  const isAdmin = userData.role === "admin" || userData.role === "super_admin";

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
                {userData.full_name?.charAt(0) || "U"}
              </div>
              <div style={styles.headerText}>
                <span style={styles.greeting}>{greeting}</span>
                <h1 style={styles.userName}>
                  {userData.full_name?.split(" ")[0]}
                </h1>
              </div>
            </div>
          </header>
          {/* BENTO GRID LAYOUT */}
          <div style={styles.bentoGrid}>
            {/* DIGITAL PASS (Large Item) */}
            <motion.div
              style={styles.bentoPass}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div style={styles.passHeader}>
                <button
                  onClick={handleUniversityClick}
                  style={styles.uniBadgeButton}
                >
                  {denormalizedProfile.university?.name || "University"}
                </button>
                <ShieldAlert size={18} color="rgba(255,255,255,0.8)" />
              </div>
              <div style={styles.passBody}>
                <h3 style={styles.passRole}>
                  {denormalizedProfile.role || userData.role}
                </h3>
              </div>
              <div style={styles.passFooter}>
                <span style={styles.passId}>
                  <div style={styles.passDetails}>
                    <p>
                      {denormalizedProfile.department?.name || "Department"}
                    </p>
                    <p>•</p>
                    <p>{denormalizedProfile.level?.name || "Level"}</p>
                  </div>
                </span>
                <div style={styles.activeDot} />
              </div>
            </motion.div>

            {/* ACTION TILES */}
            <BentoTile
              title="Notes"
              icon={<BookOpen size={22} color="white" />}
              color="#8B5CF6"
              delay={0.3}
              onClick={() => navigate("/notes")}
            />
            <BentoTile
              title="Events"
              icon={<Calendar size={22} color="white" />}
              color="#EC4899"
              delay={0.4}
              onClick={() => navigate("/events")}
            />
            <BentoTile
              title="Upload"
              icon={<UploadCloud size={22} color="white" />}
              color="#10B981"
              delay={0.5}
              onClick={() => navigate("/notes/upload")}
            />
            <BentoTile
              title="Explore"
              icon={<Search size={22} color="white" />}
              color="#3B82F6"
              delay={0.6}
              onClick={() => navigate("/explore")}
            />
          </div>
          <div style={{ height: "100px" }} /> {/* Spacer for dock */}
        </div>

        {/* --- FLOATING DOCK NAVIGATION --- */}
        <FloatingDock
          activeRoute={location.pathname}
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
              denormalizedProfile={denormalizedProfile}
              onEditProfile={() => setShowEditProfile(true)}
              onNotifications={() => setShowNotifications(true)}
              onPrivacySecurity={() => setShowPrivacySecurity(true)}
              onAppSettings={() => setShowAppSettings(true)}
              onHelpFAQ={() => setShowHelpFAQ(true)}
              onContactSupport={() => setShowContactSupport(true)}
            />
          )}
          {showEditProfile && (
            <EditProfileModal
              key="edit-profile"
              onClose={() => setShowEditProfile(false)}
              editProfileData={editProfileData}
              setEditProfileData={setEditProfileData}
              onSubmit={handleEditProfileSubmit}
              loading={loading}
              success={success}
              error={error}
            />
          )}
          {showNotifications && (
            <NotificationsModal
              key="notifications"
              onClose={() => setShowNotifications(false)}
              notificationSettings={notificationSettings}
              onSettingChange={handleNotificationChange}
              onSubmit={handleNotificationSubmit}
              loading={loading}
              success={success}
              error={error}
            />
          )}
          {showPrivacySecurity && (
            <PrivacySecurityModal
              key="privacy-security"
              onClose={() => setShowPrivacySecurity(false)}
              privacySettings={privacySettings}
              onSettingChange={handlePrivacyChange}
              onSubmit={handlePrivacySubmit}
              loading={loading}
              success={success}
              error={error}
            />
          )}
          {showAppSettings && (
            <AppSettingsModal
              key="app-settings"
              onClose={() => setShowAppSettings(false)}
              appSettings={appSettings}
              onSettingChange={handleAppSettingsChange}
              onSubmit={handleAppSettingsSubmit}
              loading={loading}
              success={success}
              error={error}
            />
          )}
          {showHelpFAQ && (
            <HelpFAQModal
              key="help-faq"
              onClose={() => setShowHelpFAQ(false)}
            />
          )}
          {showContactSupport && (
            <ContactSupportModal
              key="contact-support"
              onClose={() => setShowContactSupport(false)}
              contactForm={contactForm}
              setContactForm={setContactForm}
              onSubmit={handleContactSubmit}
              loading={loading}
              success={success}
              error={error}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// --- SUB-COMPONENTS ---

const BentoTile = ({ title, icon, color, onClick, delay }) => (
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
    <span style={styles.tileTitle}>{title}</span>
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
        You are about to log out. All unsaved progress in uploads will be lost.
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

const UserProfileModal = ({
  onClose,
  userData,
  denormalizedProfile,
  onEditProfile,
  onNotifications,
  onPrivacySecurity,
  onAppSettings,
  onHelpFAQ,
  onContactSupport,
}) => (
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
          {userData?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div style={styles.profileInfo}>
          <h2 style={styles.profileName}>
            {denormalizedProfile?.full_name || userData?.full_name || "User"}
          </h2>
          <p style={styles.profileEmail}>{userData?.email || ""}</p>
        </div>
      </div>

      <div style={styles.profileDetails}>
        <div style={styles.detailSection}>
          <h3 style={styles.sectionTitle}>Academic Information</h3>
          <div style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>University</span>
              <span style={styles.detailValue}>
                {denormalizedProfile?.university?.name || "Not set"}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Department</span>
              <span style={styles.detailValue}>
                {denormalizedProfile?.department?.name || "Not set"}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Level</span>
              <span style={styles.detailValue}>
                {denormalizedProfile?.level?.name || "Not set"}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Role</span>
              <span style={styles.detailValue}>
                {denormalizedProfile?.role || userData?.role || "Student"}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.detailSection}>
          <h3 style={styles.sectionTitle}>Account Settings</h3>
          <div style={styles.settingsGrid}>
            <button style={styles.settingButton} onClick={onEditProfile}>
              <User size={18} />
              <span>Edit Profile</span>
            </button>
            <button style={styles.settingButton} onClick={onNotifications}>
              <Bell size={18} />
              <span>Notifications</span>
            </button>
            <button style={styles.settingButton} onClick={onPrivacySecurity}>
              <ShieldAlert size={18} />
              <span>Privacy & Security</span>
            </button>
            <button style={styles.settingButton} onClick={onAppSettings}>
              <Settings size={18} />
              <span>App Settings</span>
            </button>
          </div>
        </div>

        <div style={styles.detailSection}>
          <h3 style={styles.sectionTitle}>Support</h3>
          <div style={styles.settingsGrid}>
            <button style={styles.settingButton} onClick={onHelpFAQ}>
              <BookOpen size={18} />
              <span>Help & FAQ</span>
            </button>
            <button style={styles.settingButton} onClick={onContactSupport}>
              <ChevronRight size={18} />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const EditProfileModal = ({
  onClose,
  editProfileData,
  setEditProfileData,
  onSubmit,
  loading,
  success,
  error,
}) => (
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

      <div style={styles.modalHeader}>
        <h2 style={styles.largeModalTitle}>Edit Profile</h2>
        <p style={styles.modalSubtitle}>Update your personal information</p>
      </div>

      <form onSubmit={onSubmit} style={styles.formSection}>
        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>Full Name</label>
          <input
            type="text"
            style={styles.inputField}
            value={editProfileData.full_name}
            onChange={(e) =>
              setEditProfileData((prev) => ({
                ...prev,
                full_name: e.target.value,
              }))
            }
            placeholder="Enter your full name"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>Email</label>
          <input
            type="email"
            style={styles.inputField}
            value={editProfileData.email}
            onChange={(e) =>
              setEditProfileData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Enter your email"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>Phone Number</label>
          <input
            type="tel"
            style={styles.inputField}
            value={editProfileData.phone}
            onChange={(e) =>
              setEditProfileData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Enter your phone number"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>Bio</label>
          <textarea
            style={styles.textareaField}
            value={editProfileData.bio}
            onChange={(e) =>
              setEditProfileData((prev) => ({ ...prev, bio: e.target.value }))
            }
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}
      </form>

      <div style={styles.modalActions}>
        <button
          type="button"
          onClick={onClose}
          style={styles.modalCancelBtn}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" style={styles.saveBtn} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const NotificationsModal = ({
  onClose,
  notificationSettings,
  onSettingChange,
  onSubmit,
  loading,
  success,
  error,
}) => (
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

      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>Notifications</h2>
        <p style={styles.modalSubtitle}>Manage your notification preferences</p>
      </div>

      <div style={styles.settingsSection}>
        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Push Notifications</h3>
            <p style={styles.settingDescription}>
              Receive push notifications for important updates
            </p>
          </div>
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={notificationSettings.pushNotifications}
              onChange={(e) =>
                onSettingChange("pushNotifications", e.target.checked)
              }
            />
            <span style={styles.toggleSlider}></span>
          </label>
        </div>

        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Email Notifications</h3>
            <p style={styles.settingDescription}>
              Receive email updates about your account
            </p>
          </div>
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) =>
                onSettingChange("emailNotifications", e.target.checked)
              }
            />
            <span style={styles.toggleSlider}></span>
          </label>
        </div>

        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Event Reminders</h3>
            <p style={styles.settingDescription}>
              Get reminded about upcoming events
            </p>
          </div>
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={notificationSettings.eventReminders}
              onChange={(e) =>
                onSettingChange("eventReminders", e.target.checked)
              }
            />
            <span style={styles.toggleSlider}></span>
          </label>
        </div>

        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>New Notes</h3>
            <p style={styles.settingDescription}>
              Notifications for new notes in your courses
            </p>
          </div>
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={notificationSettings.newNotes}
              onChange={(e) => onSettingChange("newNotes", e.target.checked)}
            />
            <span style={styles.toggleSlider}></span>
          </label>
        </div>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.modalActions}>
        <button
          onClick={onClose}
          style={styles.modalCancelBtn}
          disabled={loading}
        >
          Cancel
        </button>
        <button onClick={onSubmit} style={styles.saveBtn} disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const PrivacySecurityModal = ({
  onClose,
  privacySettings,
  onSettingChange,
  onSubmit,
  loading,
  success,
  error,
}) => (
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

      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>Privacy & Security</h2>
        <p style={styles.modalSubtitle}>
          Manage your privacy and security settings
        </p>
      </div>

      <div style={styles.settingsSection}>
        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Profile Visibility</h3>
            <p style={styles.settingDescription}>
              Control who can see your profile information
            </p>
          </div>
          <select
            style={styles.selectField}
            value={privacySettings.profileVisibility}
            onChange={(e) =>
              onSettingChange("profileVisibility", e.target.value)
            }
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Data Sharing</h3>
            <p style={styles.settingDescription}>
              Allow sharing of anonymized data for improvements
            </p>
          </div>
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={privacySettings.dataSharing}
              onChange={(e) => onSettingChange("dataSharing", e.target.checked)}
            />
            <span style={styles.toggleSlider}></span>
          </label>
        </div>

        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Two-Factor Authentication</h3>
            <p style={styles.settingDescription}>
              Add an extra layer of security to your account
            </p>
          </div>
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={privacySettings.twoFactorAuth}
              onChange={(e) =>
                onSettingChange("twoFactorAuth", e.target.checked)
              }
            />
            <span style={styles.toggleSlider}></span>
          </label>
        </div>

        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Change Password</h3>
            <p style={styles.settingDescription}>
              Update your account password
            </p>
          </div>
          <button style={styles.actionBtn}>Change Password</button>
        </div>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.modalActions}>
        <button
          onClick={onClose}
          style={styles.modalCancelBtn}
          disabled={loading}
        >
          Cancel
        </button>
        <button onClick={onSubmit} style={styles.saveBtn} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const AppSettingsModal = ({
  onClose,
  appSettings,
  onSettingChange,
  onSubmit,
  loading,
  success,
  error,
}) => (
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

      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>App Settings</h2>
        <p style={styles.modalSubtitle}>Customize your app experience</p>
      </div>

      <div style={styles.settingsSection}>
        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Theme</h3>
            <p style={styles.settingDescription}>Choose your preferred theme</p>
          </div>
          <select
            style={styles.selectField}
            value={appSettings.theme}
            onChange={(e) => onSettingChange("theme", e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Language</h3>
            <p style={styles.settingDescription}>Select your language</p>
          </div>
          <select
            style={styles.selectField}
            value={appSettings.language}
            onChange={(e) => onSettingChange("language", e.target.value)}
          >
            <option value="english">English</option>
            <option value="french">French</option>
            <option value="spanish">Spanish</option>
          </select>
        </div>

        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Font Size</h3>
            <p style={styles.settingDescription}>Adjust the text size</p>
          </div>
          <select
            style={styles.selectField}
            value={appSettings.fontSize}
            onChange={(e) => onSettingChange("fontSize", e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <h3 style={styles.settingTitle}>Auto-Sync</h3>
            <p style={styles.settingDescription}>
              Automatically sync data when online
            </p>
          </div>
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={appSettings.autoSync}
              onChange={(e) => onSettingChange("autoSync", e.target.checked)}
            />
            <span style={styles.toggleSlider}></span>
          </label>
        </div>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.modalActions}>
        <button
          onClick={onClose}
          style={styles.modalCancelBtn}
          disabled={loading}
        >
          Cancel
        </button>
        <button onClick={onSubmit} style={styles.saveBtn} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const HelpFAQModal = ({ onClose }) => (
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

      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>Help & FAQ</h2>
        <p style={styles.modalSubtitle}>Find answers to common questions</p>
      </div>

      <div style={styles.faqSection}>
        <div style={styles.faqItem}>
          <h3 style={styles.faqQuestion}>How do I upload notes?</h3>
          <p style={styles.faqAnswer}>
            Go to the Notes page and click the "Upload" button. Select your
            files and add relevant details like course and topic.
          </p>
        </div>

        <div style={styles.faqItem}>
          <h3 style={styles.faqQuestion}>How do I join events?</h3>
          <p style={styles.faqAnswer}>
            Visit the Events page to see upcoming events. Click "Join" on any
            event you're interested in attending.
          </p>
        </div>

        <div style={styles.faqItem}>
          <h3 style={styles.faqQuestion}>
            How do I change my profile information?
          </h3>
          <p style={styles.faqAnswer}>
            Click on your profile icon in the bottom navigation, then select
            "Edit Profile" to update your information.
          </p>
        </div>

        <div style={styles.faqItem}>
          <h3 style={styles.faqQuestion}>How do I contact support?</h3>
          <p style={styles.faqAnswer}>
            Use the "Contact Support" option in your profile menu, or email us
            at support@collig.com.
          </p>
        </div>

        <div style={styles.faqItem}>
          <h3 style={styles.faqQuestion}>Is my data secure?</h3>
          <p style={styles.faqAnswer}>
            Yes, we use industry-standard encryption and security measures to
            protect your data and privacy.
          </p>
        </div>
      </div>

      <div style={styles.modalActions}>
        <button onClick={onClose} style={styles.primaryBtn}>
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const ContactSupportModal = ({
  onClose,
  contactForm,
  setContactForm,
  user,
  userData,
  loading,
  success,
  error,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!contactForm.message.trim()) return;

    const phoneNumber = "254762634893"; // 👉 YOUR WhatsApp number (NO +)

    const fullMessage = `
Support Request
-------------------------
Name: ${userData?.full_name || "Unknown"}
Email: ${user?.email || "Not provided"}
Subject: ${contactForm.subject}

Message:
${contactForm.message}
    `.trim();

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      fullMessage,
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
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

        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Contact Support</h2>
          <p style={styles.modalSubtitle}>
            We're here to help! Get in touch with our support team.
          </p>
        </div>

        <div style={styles.contactSection}>
          <div style={styles.contactItem}>
            <div style={styles.contactIcon}>
              <Bell size={24} />
            </div>
            <div style={styles.contactInfo}>
              <h3 style={styles.contactTitle}>Email Support</h3>
              <p style={styles.contactNote}>Response within 24 hours</p>
            </div>
          </div>

          <div style={styles.contactItem}>
            <div style={styles.contactIcon}>
              <BookOpen size={24} />
            </div>
            <div style={styles.contactInfo}>
              <h3 style={styles.contactTitle}>Live Chat</h3>
              <p style={styles.contactDescription}>Available 9 AM - 6 PM EST</p>
              <p style={styles.contactNote}>Instant responses</p>
            </div>
          </div>

          <div style={styles.contactItem}>
            <div style={styles.contactIcon}>
              <ChevronRight size={24} />
            </div>
            <div style={styles.contactInfo}>
              <h3 style={styles.contactTitle}>Phone Support</h3>
              <p style={styles.contactNote}>Mon-Fri, 9 AM - 6 PM EST</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formSection}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Subject</label>
              <select
                style={styles.selectField}
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Issue</option>
                <option value="account">Account Problem</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Message</label>
              <textarea
                style={styles.textareaField}
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                placeholder="Describe your issue or question..."
                rows={4}
                required
              />
            </div>
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}
          {success && <div style={styles.successMessage}>{success}</div>}

          <div style={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.modalCancelBtn}
            >
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn}>
              Send via WhatsApp
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const SadGhost = () => (
  <div style={styles.ghostWrapper}>
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={styles.ghostContainer}
    >
      <div style={styles.ghostBody}>
        <div style={styles.ghostFace}>
          <div style={styles.ghostEyes}>
            <div style={styles.eye} />
            <div style={styles.eye} />
          </div>
          <div style={styles.ghostMouth} />
        </div>
      </div>
    </motion.div>
    <div style={styles.ghostShadow} />
  </div>
);

const LoadingScreen = () => (
  <div
    style={{
      height: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#F3F4F6",
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8 }}
      style={{
        width: 30,
        height: 30,
        border: "3px solid #E5E7EB",
        borderTopColor: "#6366F1",
        borderRadius: "50%",
      }}
    />
  </div>
);

// --- STYLES (Inline CSS for portability) ---

const styles = {
  pageContainer: {
    minHeight: "100vh",
    width: "100%",
    fontFamily: "'Montserrat', sans-serif",
    position: "relative",
    color: "#1F2937",
    overflow: "hidden",
  },

  // MESH BACKGROUND
  meshBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "#F3F4F6", // Light grey base
    zIndex: 0,
  },
  meshOrb: {
    position: "absolute",
    borderRadius: "50%",
    width: "600px",
    height: "600px",
    filter: "blur(100px)",
    opacity: 0.4,
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
    maxWidth: "600px",
    margin: "0 auto",
    transition: "filter 0.3s ease",
  },

  // HEADER
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "24px",
    paddingTop: "10px",
  },
  headerProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    backgroundColor: "#1F2937",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
  },
  headerText: { display: "flex", flexDirection: "column" },
  greeting: {
    fontSize: "12px",
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  userName: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#111827",
    margin: 0,
    textAlign: "center",
  },
  notificationBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer",
  },
  notificationDot: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "8px",
    height: "8px",
    backgroundColor: "#EF4444",
    borderRadius: "50%",
    border: "1px solid white",
  },

  // BENTO GRID
  bentoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  bentoPass: {
    gridColumn: "span 2",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    borderRadius: "22px",
    padding: "20px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  passHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    opacity: 0.8,
  },
  uniBadge: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  uniBadgeButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    opacity: 0.8,
    transition: "opacity 0.2s ease",
  },
  passBody: { marginTop: "5px" },
  passRole: {
    fontSize: "22px",
    fontWeight: "800",
    margin: "0 0 4px 0",
    color: "#FBBF24",
  }, // Amber color for role
  passDetails: {
    display: "flex",
    gap: "8px",
    fontSize: "13px",
    color: "#94A3B8",
  },
  passFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    fontFamily: "monospace",
    opacity: 0.6,
  },
  activeDot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#10B981",
    borderRadius: "50%",
    boxShadow: "0 0 8px #10B981",
  },

  bentoTile: {
    backgroundColor: "white",
    border: "none",
    borderRadius: "20px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "flex-start",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    cursor: "pointer",
    height: "110px",
  },
  tileIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  tileTitle: { fontSize: "15px", fontWeight: "700", color: "#374151" },

  adminTile: {
    gridColumn: "span 2",
    backgroundColor: "#EEF2FF",
    padding: "12px 20px",
    borderRadius: "14px",
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },

  // FLOATING DOCK
  dockContainer: {
    position: "fixed",
    bottom: "30px",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 50,
  },
  dock: {
    backgroundColor: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    padding: "10px 20px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(255,255,255,0.6)",
  },
  dockItem: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    position: "relative",
  },
  dockActiveDot: {
    width: "4px",
    height: "4px",
    backgroundColor: "#6366f1",
    borderRadius: "50%",
    position: "absolute",
    bottom: "-6px",
  },
  dockDivider: { width: "1px", height: "24px", backgroundColor: "#E5E7EB" },

  // MODAL
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(4px)",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modalCard: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: "340px",
    borderRadius: "24px",
    padding: "30px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  closeModalBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9CA3AF",
  },
  modalTitle: {
    margin: "10px 0 8px",
    fontSize: "18px",
    fontWeight: "800",
    color: "#111827",
  },
  modalText: {
    margin: "0 0 24px",
    fontSize: "13px",
    color: "#6B7280",
    lineHeight: "1.5",
  },
  modalGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  cancelBtn: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    background: "white",
    color: "#374151",
    fontWeight: "600",
    cursor: "pointer",
  },
  confirmBtn: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#EF4444",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  // GHOST
  ghostWrapper: {
    position: "relative",
    height: "60px",
    width: "60px",
    margin: "0 auto 10px",
  },
  ghostContainer: { position: "relative", zIndex: 2 },
  ghostBody: {
    width: "50px",
    height: "60px",
    backgroundColor: "#F3F4F6",
    borderRadius: "25px 25px 0 0",
    margin: "0 auto",
    position: "relative",
    border: "2px solid #E5E7EB",
    borderBottom: "none",
  },
  ghostFace: { position: "absolute", top: "20px", left: "12px" },
  ghostEyes: { display: "flex", gap: "14px", marginBottom: "4px" },
  eye: {
    width: "5px",
    height: "5px",
    backgroundColor: "#374151",
    borderRadius: "50%",
  },
  ghostMouth: {
    width: "8px",
    height: "4px",
    border: "2px solid #374151",
    borderBottom: "none",
    borderRadius: "50% 50% 0 0",
    margin: "0 auto",
  },
  ghostShadow: {
    width: "40px",
    height: "6px",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "50%",
    margin: "0 auto",
    marginTop: "5px",
  },

  // USER PROFILE MODAL
  profileModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(8px)",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  profileModalCard: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    borderRadius: "24px",
    padding: "30px",
    position: "relative",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "auto",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid #E5E7EB",
  },
  profileAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    backgroundColor: "#6366f1",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  profileEmail: {
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
  },
  profileDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  detailSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#374151",
    margin: 0,
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  },
  settingsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  settingButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    backgroundColor: "white",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // FORM STYLES
  modalHeader: {
    marginBottom: "24px",
  },
  largeModalTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  modalSubtitle: {
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
  },
  formSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  inputLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  inputField: {
    padding: "12px 16px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "white",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  textareaField: {
    padding: "12px 16px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "white",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    transition: "border-color 0.2s ease",
  },
  selectField: {
    padding: "12px 16px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "white",
    outline: "none",
    cursor: "pointer",
    transition: "border-color 0.2s ease",
  },

  // SETTINGS STYLES
  settingsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "24px",
  },
  settingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    backgroundColor: "white",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  settingDescription: {
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
  },

  // TOGGLE STYLES
  toggle: {
    position: "relative",
    display: "inline-block",
    width: "44px",
    height: "24px",
    cursor: "pointer",
  },
  toggleSlider: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E5E7EB",
    borderRadius: "24px",
    transition: "background-color 0.3s ease",
  },

  // ACTION BUTTONS
  actionBtn: {
    padding: "8px 16px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // MODAL ACTIONS
  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  modalCancelBtn: {
    padding: "12px 24px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  saveBtn: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#6366f1",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  primaryBtn: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#6366f1",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // FAQ STYLES
  faqSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
  },
  faqItem: {
    padding: "16px",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    backgroundColor: "white",
  },
  faqQuestion: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  faqAnswer: {
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
    lineHeight: "1.5",
  },

  // CONTACT STYLES
  contactSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    backgroundColor: "white",
  },
  contactIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6366f1",
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  contactDescription: {
    fontSize: "14px",
    color: "#374151",
    margin: "0 0 2px 0",
  },
  contactNote: {
    fontSize: "12px",
    color: "#6B7280",
    margin: 0,
  },

  // MESSAGE STYLES
  errorMessage: {
    padding: "12px 16px",
    backgroundColor: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "8px",
    color: "#DC2626",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "16px",
  },
  successMessage: {
    padding: "12px 16px",
    backgroundColor: "#F0FDF4",
    border: "1px solid #BBF7D0",
    borderRadius: "8px",
    color: "#16A34A",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "16px",
  },
};
