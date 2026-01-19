import { useEffect, useState } from "react";
import {
  getPendingSchools,
  approveSchool,
  rejectSchool,
  createSchool,
  getAllSchools,
} from "../../services/adminSchools.service";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminSchools() {
  const [schools, setSchools] = useState([]);
  const [pendingSchools, setPendingSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const [allSchools, pending] = await Promise.all([
        getAllSchools(),
        getPendingSchools(),
      ]);
      setSchools(allSchools);
      setPendingSchools(pending);
    } catch (err) {
      console.error("Error loading schools:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (schoolId) => {
    try {
      await approveSchool(schoolId);
      setPendingSchools((s) => s.filter((school) => school.id !== schoolId));
      loadSchools(); // Refresh all
    } catch (err) {
      alert("Failed to approve school");
    }
  };

  const handleReject = async (schoolId) => {
    const reason = prompt("Reason for rejection (optional)");
    try {
      await rejectSchool(schoolId, reason);
      setPendingSchools((s) => s.filter((school) => school.id !== schoolId));
      loadSchools();
    } catch (err) {
      alert("Failed to reject school");
    }
  };

  if (loading) return <div>Loading schools...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>School Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={styles.createBtn}
        >
          <Plus size={18} />
          Create School
        </button>
      </div>

      {/* Pending Schools */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Clock size={20} />
          Pending Approval ({pendingSchools.length})
        </h2>
        {pendingSchools.length === 0 ? (
          <p>No pending schools.</p>
        ) : (
          <div style={styles.grid}>
            {pendingSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                isPending
                onApprove={() => handleApprove(school.id)}
                onReject={() => handleReject(school.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* All Schools */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Building2 size={20} />
          All Schools ({schools.length})
        </h2>
        <div style={styles.grid}>
          {schools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateSchoolModal
            onClose={() => setShowCreateModal(false)}
            onCreated={() => {
              setShowCreateModal(false);
              loadSchools();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const SchoolCard = ({ school, isPending, onApprove, onReject }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "rejected":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={styles.card}
    >
      <div style={styles.cardHeader}>
        <Building2 size={24} color="#6366f1" />
        <div
          style={{
            ...styles.statusBadge,
            backgroundColor: getStatusColor(school.status),
          }}
        >
          {school.status}
        </div>
      </div>
      <h3 style={styles.schoolName}>{school.name}</h3>
      <p style={styles.schoolType}>{school.type || "University"}</p>
      <p style={styles.schoolLocation}>
        {school.location || "Location not specified"}
      </p>

      {isPending && (
        <div style={styles.actions}>
          <button onClick={onApprove} style={styles.approveBtn}>
            <Check size={16} />
            Approve
          </button>
          <button onClick={onReject} style={styles.rejectBtn}>
            <X size={16} />
            Reject
          </button>
        </div>
      )}
    </motion.div>
  );
};

const CreateSchoolModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    type: "university",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSchool(form);
      onCreated();
    } catch (err) {
      alert("Failed to create school");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.modalOverlay}
      onClick={onClose}
    >
      <motion.form
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        style={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div style={styles.modalHeader}>
          <h2>Create New School</h2>
          <button onClick={onClose} style={styles.closeBtn} type="button">
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>School Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              style={styles.input}
            >
              <option value="university">University</option>
              <option value="college">College</option>
              <option value="institute">Institute</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              style={{ ...styles.input, minHeight: 80 }}
            />
          </div>
        </div>

        <div
          style={{
            padding: 24,
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <button type="button" onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Creating..." : "Create School"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

const styles = {
  container: { padding: 24, maxWidth: 1200, margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  createBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 20px",
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  section: { marginBottom: 40 },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: 12,
    color: "white",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
  },
  schoolName: { fontSize: 18, fontWeight: 700, margin: "0 0 4px 0" },
  schoolType: { fontSize: 14, color: "#6B7280", margin: "0 0 4px 0" },
  schoolLocation: { fontSize: 14, color: "#6B7280", margin: 0 },
  actions: { display: "flex", gap: 8, marginTop: 16 },
  approveBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "8px",
    backgroundColor: "#10B981",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  rejectBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "8px",
    backgroundColor: "#EF4444",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
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
    borderRadius: 12,
    maxWidth: 500,
    width: "90%",
    maxHeight: "80vh",
    overflow: "hidden",
  },
  modalHeader: {
    padding: 24,
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6B7280",
  },
  formGroup: { marginBottom: 16 },
  label: { display: "block", marginBottom: 8, fontWeight: 600 },
  input: {
    width: "100%",
    padding: 10,
    border: "1px solid #E5E7EB",
    borderRadius: 6,
    fontSize: 14,
  },
  cancelBtn: {
    padding: "10px 16px",
    border: "1px solid #E5E7EB",
    background: "white",
    borderRadius: 6,
    cursor: "pointer",
  },
  submitBtn: {
    padding: "10px 16px",
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
