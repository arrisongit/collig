import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";

export const createSchool = async (schoolData) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const adminSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
  if (!adminSnap.exists()) throw new Error("Admin profile missing");

  const adminData = adminSnap.data();
  if (!["admin", "super_admin"].includes(adminData.role)) {
    throw new Error("Unauthorized");
  }

  // Check if admin already has a school
  if (adminData.role === "admin") {
    const existingQuery = query(
      collection(db, "universities"),
      where("admin_uid", "==", auth.currentUser.uid),
    );
    const existingSnap = await getDocs(existingQuery);
    if (!existingSnap.empty) {
      throw new Error(
        "You already have a school. Admins can only manage one school.",
      );
    }
  }

  return await addDoc(collection(db, "universities"), {
    ...schoolData,
    status: adminData.role === "admin" ? "approved" : "pending",
    admin_uid: adminData.role === "admin" ? auth.currentUser.uid : null,
    created_by: auth.currentUser.uid,
    created_at: serverTimestamp(),
  });
};

export const getPendingSchools = async () => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const adminSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
  if (!adminSnap.exists()) throw new Error("Admin profile missing");

  const adminData = adminSnap.data();
  if (!["admin", "super_admin"].includes(adminData.role)) {
    throw new Error("Unauthorized");
  }

  let q;
  if (adminData.role === "super_admin") {
    q = query(collection(db, "universities"), where("status", "==", "pending"));
  } else {
    // Admins can only see schools they created or for their university type?
    q = query(collection(db, "universities"), where("status", "==", "pending"));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const approveSchool = async (schoolId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const adminSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
  if (!adminSnap.exists()) throw new Error("Admin profile missing");

  const adminData = adminSnap.data();
  if (!["admin", "super_admin"].includes(adminData.role)) {
    throw new Error("Unauthorized");
  }

  await updateDoc(doc(db, "universities", schoolId), {
    status: "approved",
    approved_by: auth.currentUser.uid,
    approved_at: serverTimestamp(),
  });
};

export const rejectSchool = async (schoolId, reason) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  await updateDoc(doc(db, "universities", schoolId), {
    status: "rejected",
    rejection_reason: reason || null,
    rejected_at: serverTimestamp(),
  });
};

export const getAllSchools = async () => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const adminSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
  if (!adminSnap.exists()) throw new Error("Admin profile missing");

  const adminData = adminSnap.data();
  if (!["admin", "super_admin"].includes(adminData.role)) {
    throw new Error("Unauthorized");
  }

  const snapshot = await getDocs(collection(db, "universities"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};
