import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";

export const assignUserUniversityAndRole = async ({
  targetUserId,
  university_id,
  role = "student",
}) => {
  const adminId = auth.currentUser.uid;
  const adminSnap = await getDoc(doc(db, "users", adminId));
  const adminData = adminSnap.data();

  // Authorization
  if (adminData.role !== "super_admin" && adminData.role !== "admin") {
    throw new Error("Unauthorized");
  }

  if (adminData.role === "admin" && role !== "student") {
    throw new Error("Admins cannot assign admin roles");
  }

  await updateDoc(doc(db, "users", targetUserId), {
    university_id,
    role,
  });
};
