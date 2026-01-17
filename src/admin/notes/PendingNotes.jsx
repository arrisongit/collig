import { useEffect, useState } from "react";
import { fetchPendingNotesForAdmin } from "../../services/adminNotes.service";
import NoteModerationCard from "./NoteModerationCard";

export default function PendingNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPendingNotes = async () => {
      try {
        const pendingNotes = await fetchPendingNotesForAdmin();
        setNotes(pendingNotes);
      } catch (err) {
        console.error("Error loading pending notes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPendingNotes();
  }, []);

  if (loading) return <div>Loading pending notes...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h2>Pending Notes for Review</h2>
      {notes.length === 0 ? (
        <p>No pending notes to review.</p>
      ) : (
        notes.map((note) => (
          <NoteModerationCard
            key={note.id}
            note={note}
            onAction={refreshNotes}
          />
        ))
      )}
    </div>
  );

  function refreshNotes() {
    // Reload notes after approval/rejection
    setLoading(true);
    fetchPendingNotesForAdmin()
      .then(setNotes)
      .catch((err) => {
        console.error("Error refreshing notes:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }
}
