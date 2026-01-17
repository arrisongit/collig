import {
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";

export const assignUserUniversityAndRole = async ({
  targetUserId,
  university_id,
  role,
}) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const adminSnap = await getDoc(doc(db, "users", auth.currentUser.uid));

  if (!adminSnap.exists()) throw new Error("Admin profile missing");

  await updateDoc(doc(db, "users", targetUserId), {
    university_id,
    role,
  });
};

export const approveNote = async (noteId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  await updateDoc(doc(db, "notes", noteId), {
    status: "approved",
    approved_at: serverTimestamp(),
  });
};

export const rejectNote = async (noteId, reason) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  await updateDoc(doc(db, "notes", noteId), {
    status: "rejected",
    rejection_reason: reason,
    rejected_at: serverTimestamp(),
  });
};

/**
 * FETCH PENDING NOTES FOR ADMIN (SAME UNIVERSITY ONLY)
 */
export const fetchPendingNotesForAdmin = async () => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const adminSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
  if (!adminSnap.exists()) throw new Error("Admin profile missing");

  const adminData = adminSnap.data();
  if (!["admin", "super_admin"].includes(adminData.role)) {
    throw new Error("Unauthorized");
  }

  let q;
  if (adminData.role === "super_admin") {
    q = query(collection(db, "notes"), where("status", "==", "pending"));
  } else {
    q = query(
      collection(db, "notes"),
      where("status", "==", "pending"),
      where("university_id", "==", adminData.university_id)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * DELETE NOTE (ADMIN ONLY)
 */
export const deleteNote = async (noteId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const adminSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
  if (!adminSnap.exists()) throw new Error("Admin profile missing");

  const adminData = adminSnap.data();
  if (!["admin", "super_admin"].includes(adminData.role)) {
    throw new Error("Unauthorized");
  }

  // Check if note belongs to admin's university (unless super_admin)
  if (adminData.role !== "super_admin") {
    const noteSnap = await getDoc(doc(db, "notes", noteId));
    if (
      !noteSnap.exists() ||
      noteSnap.data().university_id !== adminData.university_id
    ) {
      throw new Error("Unauthorized");
    }
  }

  // Note: In a real app, also delete the file from Cloudinary
  // For now, just delete the document
  await updateDoc(doc(db, "notes", noteId), {
    status: "deleted",
    deleted_at: serverTimestamp(),
  });
};
