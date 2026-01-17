import { useState } from "react";
import {
  approveNote,
  rejectNote,
  deleteNote,
} from "../../services/adminNotes.service";

export default function NoteModerationCard({ note, onAction }) {
  const [loading, setLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this note?")) return;

    setLoading(true);
    try {
      await approveNote(note.id);
      alert("Note approved!");
      onAction && onAction();
    } catch (error) {
      alert("Approval failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    setLoading(true);
    try {
      await rejectNote(note.id, rejectionReason);
      alert("Note rejected.");
      setShowRejectForm(false);
      setRejectionReason("");
      onAction && onAction();
    } catch (error) {
      alert("Rejection failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this note?"))
      return;

    setLoading(true);
    try {
      await deleteNote(note.id);
      alert("Note deleted.");
      onAction && onAction();
    } catch (error) {
      alert("Deletion failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3>{note.title}</h3>
        <span style={styles.status}>Pending Review</span>
      </div>

      <div style={styles.details}>
        <p>
          <strong>Uploader:</strong> {note.uploader_name}
        </p>
        <p>
          <strong>Department:</strong> {note.department_id}
        </p>
        <p>
          <strong>Level:</strong> {note.level_id}
        </p>
        <p>
          <strong>Course:</strong> {note.course_id}
        </p>
        <p>
          <strong>File Type:</strong> {note.file_type}
        </p>
        <p>
          <strong>File Size:</strong> {formatFileSize(note.file_size)}
        </p>
        <p>
          <strong>Uploaded:</strong>{" "}
          {note.created_at?.toDate?.()?.toLocaleDateString() || "Unknown"}
        </p>
      </div>

      <div style={styles.preview}>
        {note.file_type === "image" ? (
          <img
            src={note.file_url}
            alt="Note preview"
            style={styles.imagePreview}
            onClick={() => window.open(note.file_url, "_blank")}
          />
        ) : (
          <div style={styles.pdfPreview}>
            <p>📄 PDF Document</p>
            <button
              onClick={() => window.open(note.file_url, "_blank")}
              style={styles.previewBtn}
            >
              View PDF
            </button>
          </div>
        )}
      </div>

      <div style={styles.actions}>
        <button
          onClick={handleApprove}
          disabled={loading}
          style={{ ...styles.approveBtn, opacity: loading ? 0.5 : 1 }}
        >
          ✅ Approve
        </button>

        {!showRejectForm ? (
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={loading}
            style={{ ...styles.rejectBtn, opacity: loading ? 0.5 : 1 }}
          >
            ❌ Reject
          </button>
        ) : (
          <div style={styles.rejectForm}>
            <textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={styles.rejectTextarea}
            />
            <div style={styles.rejectActions}>
              <button
                onClick={handleReject}
                disabled={loading}
                style={styles.confirmRejectBtn}
              >
                Confirm Reject
              </button>
              <button
                onClick={() => setShowRejectForm(false)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleDelete}
          disabled={loading}
          style={{ ...styles.deleteBtn, opacity: loading ? 0.5 : 1 }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  status: {
    backgroundColor: "#ffc107",
    color: "#000",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  details: {
    marginBottom: "15px",
  },
  preview: {
    marginBottom: "15px",
    textAlign: "center",
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: "300px",
    cursor: "pointer",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  pdfPreview: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
  },
  previewBtn: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  approveBtn: {
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  rejectBtn: {
    padding: "8px 16px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "8px 16px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  rejectForm: {
    width: "100%",
    marginTop: "10px",
  },
  rejectTextarea: {
    width: "100%",
    minHeight: "80px",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  rejectActions: {
    display: "flex",
    gap: "10px",
  },
  confirmRejectBtn: {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "6px 12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
