import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";

export const fetchPendingEventsForAdmin = async () => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const adminSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
  if (!adminSnap.exists()) throw new Error("Admin profile missing");

  const adminData = adminSnap.data();
  if (!["admin", "super_admin"].includes(adminData.role)) {
    throw new Error("Unauthorized");
  }

  let q;
  if (adminData.role === "super_admin") {
    q = query(collection(db, "events"), where("status", "==", "pending"));
  } else {
    q = query(
      collection(db, "events"),
      where("status", "==", "pending"),
      where("university_id", "==", adminData.university_id),
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const approveEvent = async (eventId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  await updateDoc(doc(db, "events", eventId), {
    status: "approved",
    approved_at: serverTimestamp(),
  });
};

export const rejectEvent = async (eventId, reason) => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  await updateDoc(doc(db, "events", eventId), {
    status: "rejected",
    rejection_reason: reason || null,
    rejected_at: serverTimestamp(),
  });
};
