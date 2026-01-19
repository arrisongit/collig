import { useEffect, useState } from "react";
import {
  fetchPendingEventsForAdmin,
  approveEvent,
  rejectEvent,
} from "../../services/adminEvents.service";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const pending = await fetchPendingEventsForAdmin();
        setEvents(pending);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading pending events...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h2>Pending Events</h2>
      {events.length === 0 ? (
        <p>No pending events.</p>
      ) : (
        events.map((ev) => (
          <div
            key={ev.id}
            style={{ padding: 12, borderBottom: "1px solid #eee" }}
          >
            <h3 style={{ margin: 0 }}>{ev.title}</h3>
            <p style={{ margin: "6px 0" }}>
              {new Date(
                ev.date?.seconds ? ev.date.toDate() : ev.date,
              ).toString()}
            </p>
            <p style={{ margin: "6px 0", color: "#555" }}>
              By {ev.uploader_name || "Unknown"}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={async () => {
                  await approveEvent(ev.id);
                  setEvents((s) => s.filter((e) => e.id !== ev.id));
                }}
              >
                Approve
              </button>
              <button
                onClick={async () => {
                  const reason = prompt("Reason for rejection (optional)");
                  await rejectEvent(ev.id, reason);
                  setEvents((s) => s.filter((e) => e.id !== ev.id));
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
