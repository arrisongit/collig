import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Filter,
  ChevronRight,
  Share2,
  Heart,
  CalendarPlus,
  X,
  Users,
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

export default function EventsPage() {
  const { userData } = useAuth();

  // Data State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [filter, setFilter] = useState("upcoming"); // upcoming, past, all
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null); // For Modal

  // --- Fetch Data ---
  useEffect(() => {
    if (!userData?.university_id) return;

    const loadEvents = async () => {
      try {
        // Simple query, we will sort/filter client side for smoother UX on small datasets
        const q = query(
          collection(db, "events"),
          where("university_id", "==", userData.university_id)
        );

        const snapshot = await getDocs(q);
        const fetchedEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamp to JS Date
          jsDate: doc.data().date?.toDate
            ? doc.data().date.toDate()
            : new Date(doc.data().date),
        }));

        // Sort by date ascending
        fetchedEvents.sort((a, b) => a.jsDate - b.jsDate);
        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [userData?.university_id]);

  // --- Filtering Logic ---
  const filteredEvents = useMemo(() => {
    const now = new Date();

    let result = events;

    // 1. Filter by Tab
    if (filter === "upcoming") {
      result = result.filter((e) => e.jsDate >= now);
    } else if (filter === "past") {
      result = result.filter((e) => e.jsDate < now);
    }

    // 2. Filter by Search
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(lowerQ) ||
          e.location?.toLowerCase().includes(lowerQ)
      );
    }

    return result;
  }, [events, filter, searchQuery]);

  // Highlight the next big event
  const featuredEvent = useMemo(() => {
    const now = new Date();
    return events.find((e) => e.jsDate >= now);
  }, [events]);

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
              background: "#8B5CF6",
            }}
          />
          <motion.div
            animate={{ x: [-50, 50, -50] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{
              ...styles.meshOrb,
              bottom: "-20%",
              right: "-10%",
              background: "#3B82F6",
            }}
          />
          <div style={styles.glassOverlay} />
        </div>

        <div style={styles.contentContainer}>
          {/* HEADER */}
          <div style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>Campus Events</h1>
              <p style={styles.pageSubtitle}>
                Discover what's happening at {userData.university_name}
              </p>
            </div>
            <div style={styles.searchBar}>
              <Search size={18} color="#6B7280" />
              <input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          {/* FEATURED EVENT (Only show if not searching/filtering past) */}
          {!searchQuery && filter === "upcoming" && featuredEvent && (
            <FeaturedCard
              event={featuredEvent}
              onClick={() => setSelectedEvent(featuredEvent)}
            />
          )}

          {/* TABS */}
          <div style={styles.tabContainer}>
            {["upcoming", "all", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  ...styles.tabBtn,
                  backgroundColor: filter === tab ? "#1F2937" : "transparent",
                  color: filter === tab ? "white" : "#6B7280",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* EVENTS GRID */}
          {loading ? (
            <LoadingState />
          ) : filteredEvents.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div layout style={styles.grid}>
              <AnimatePresence>
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {selectedEvent && (
            <EventModal
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// --- SUB-COMPONENTS ---

const FeaturedCard = ({ event, onClick }) => {
  // Generate a consistent gradient based on title length
  const gradient =
    event.title.length % 2 === 0
      ? "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)"
      : "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      style={{ ...styles.featuredCard, background: gradient }}
    >
      <div style={styles.featuredContent}>
        <div style={styles.featuredBadge}>Next Up</div>
        <h2 style={styles.featuredTitle}>{event.title}</h2>
        <div style={styles.featuredMeta}>
          <span style={styles.metaItemLight}>
            <Calendar size={16} /> {event.jsDate.toDateString()}
          </span>
          <span style={styles.metaItemLight}>
            <MapPin size={16} /> {event.location || "TBA"}
          </span>
        </div>
      </div>
      <div style={styles.featuredAction}>
        <div style={styles.arrowCircle}>
          <ChevronRight size={24} color="white" />
        </div>
      </div>
      <div style={styles.noiseOverlay} />
    </motion.div>
  );
};

const EventCard = ({ event, onClick }) => {
  const month = event.jsDate.toLocaleString("default", { month: "short" });
  const day = event.jsDate.getDate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      style={styles.card}
    >
      <div style={styles.cardDateBox}>
        <span style={styles.dateMonth}>{month}</span>
        <span style={styles.dateDay}>{day}</span>
      </div>

      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{event.title}</h3>
        <p style={styles.cardLoc}>{event.location || "Location TBA"}</p>
        <div style={styles.cardFooter}>
          <div style={styles.attendees}>
            <Users size={14} />
            <span>{Math.floor(Math.random() * 50) + 10}+ going</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EventModal = ({ event, onClose }) => {
  const [rsvp, setRsvp] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.modalOverlay}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        style={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Header */}
        <div style={styles.modalHeader}>
          <div style={styles.modalDateBadge}>
            {event.jsDate.toLocaleDateString()}
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.modalBody}>
          <h2 style={styles.modalTitle}>{event.title}</h2>

          <div style={styles.modalMetaGrid}>
            <div style={styles.modalMetaItem}>
              <div style={styles.iconBox}>
                <Clock size={20} color="#4F46E5" />
              </div>
              <div>
                <label style={styles.metaLabel}>Time</label>
                <p style={styles.metaValue}>
                  {event.jsDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div style={styles.modalMetaItem}>
              <div style={styles.iconBox}>
                <MapPin size={20} color="#EC4899" />
              </div>
              <div>
                <label style={styles.metaLabel}>Location</label>
                <p style={styles.metaValue}>{event.location || "TBA"}</p>
              </div>
            </div>
          </div>

          <div style={styles.modalDesc}>
            <h4 style={styles.descTitle}>About Event</h4>
            <p style={styles.descText}>
              {event.description || "No description provided for this event."}
            </p>
          </div>

          <div style={styles.modalActions}>
            <button
              onClick={() => setRsvp(!rsvp)}
              style={{
                ...styles.rsvpBtn,
                backgroundColor: rsvp ? "#10B981" : "#1F2937",
              }}
            >
              {rsvp ? <CheckCircleIcon /> : "RSVP Now"}
            </button>
            <button style={styles.iconActionBtn}>
              <CalendarPlus size={20} />
            </button>
            <button style={styles.iconActionBtn}>
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CheckCircleIcon = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <span>Going</span>
  </div>
);

const LoadingState = () => (
  <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
);

const EmptyState = () => (
  <div style={styles.emptyState}>
    <div style={styles.emptyIcon}>
      <Calendar size={40} />
    </div>
    <h3>No Events Found</h3>
    <p>Looks like nothing is scheduled matching your criteria.</p>
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
  pageTitle: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 8px 0",
    color: "#111827",
  },
  pageSubtitle: { fontSize: "14px", color: "#6B7280", margin: 0 },
  searchBar: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: "300px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    fontFamily: "inherit",
  },

  // Featured
  featuredCard: {
    borderRadius: "24px",
    padding: "30px",
    color: "white",
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  featuredBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: "fit-content",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  featuredTitle: {
    fontSize: "28px",
    fontWeight: "800",
    margin: "0 0 16px 0",
    maxWidth: "80%",
  },
  featuredMeta: { display: "flex", gap: "20px" },
  metaItemLight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },
  featuredAction: { position: "relative", zIndex: 2 },
  arrowCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noiseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')",
    zIndex: 0,
  },

  // Tabs
  tabContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    borderBottom: "1px solid #E5E7EB",
    paddingBottom: "10px",
  },
  tabBtn: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "6px",
    display: "flex",
    gap: "16px",
    alignItems: "center",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    cursor: "pointer",
    height: "100px",
  },
  cardDateBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: "16px",
    width: "80px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dateMonth: {
    fontSize: "12px",
    color: "#EF4444",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  dateDay: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
    lineHeight: "1",
  },
  cardContent: { flex: 1, paddingRight: "16px", overflow: "hidden" },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardLoc: { fontSize: "13px", color: "#6B7280", margin: "0 0 10px 0" },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "12px",
    color: "#4B5563",
  },
  attendees: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "#F9FAFB",
    padding: "4px 8px",
    borderRadius: "10px",
  },

  // Empty State
  emptyState: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  emptyIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#E5E7EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    color: "#9CA3AF",
  },

  // Modal
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(8px)",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modalCard: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: "500px",
    borderRadius: "30px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
  },
  modalHeader: {
    height: "120px",
    background: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
    position: "relative",
    padding: "20px",
  },
  modalDateBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(4px)",
    padding: "6px 12px",
    borderRadius: "12px",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    width: "fit-content",
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "white",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
  },
  modalBody: {
    padding: "30px",
    marginTop: "-40px",
    backgroundColor: "white",
    borderRadius: "30px 30px 0 0",
    position: "relative",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "800",
    margin: "0 0 24px 0",
    color: "#111827",
  },
  modalMetaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },
  modalMetaItem: { display: "flex", gap: "12px", alignItems: "center" },
  iconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    backgroundColor: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  metaLabel: {
    fontSize: "11px",
    color: "#6B7280",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  metaValue: { fontSize: "14px", fontWeight: "600", color: "#1F2937" },
  modalDesc: { marginBottom: "30px" },
  descTitle: { fontSize: "16px", fontWeight: "700", marginBottom: "8px" },
  descText: { fontSize: "14px", color: "#4B5563", lineHeight: "1.6" },
  modalActions: { display: "flex", gap: "12px" },
  rsvpBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "16px",
    border: "none",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconActionBtn: {
    width: "50px",
    borderRadius: "16px",
    border: "1px solid #E5E7EB",
    backgroundColor: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#374151",
  },
};
