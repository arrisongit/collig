import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { auth } from "../../config/firebase";
import { getCourses as getCoursesFromOnboarding } from "../../services/onboarding.service";

/**
 * FETCH APPROVED NOTES BY COURSE (SAME UNIVERSITY ONLY)
 */
export const fetchNotesByCourse = async (courseId, universityId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const q = query(
    collection(db, "notes"),
    where("course_id", "==", courseId),
    where("university_id", "==", universityId),
    where("status", "==", "approved")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * UPLOAD NOTE
 */
export const uploadNote = async (payload) => {
  return await addDoc(collection(db, "notes"), {
    ...payload,
    download_count: 0,
    created_at: serverTimestamp(),
  });
};

/**
 * FETCH USER'S OWN NOTES (PENDING, APPROVED, REJECTED)
 */
export const fetchUserNotes = async () => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const q = query(
    collection(db, "notes"),
    where("uploader_id", "==", auth.currentUser.uid)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * DOWNLOAD NOTE (INCREMENT COUNTER)
 */
export const downloadNote = async (noteId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  await updateDoc(doc(db, "notes", noteId), {
    download_count: increment(1),
  });

  // Return the file URL (in real app, this would be the Cloudinary URL)
  const noteSnap = await getDoc(doc(db, "notes", noteId));
  return noteSnap.data()?.file_url;
};

/**
 * RATE NOTE
 */
export const rateNote = async (noteId, rating) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  // Check if user already rated this note
  const existingRating = await getDoc(
    doc(db, `notes/${noteId}/ratings`, auth.currentUser.uid)
  );
  if (existingRating.exists()) {
    throw new Error("You have already rated this note");
  }

  await addDoc(collection(db, `notes/${noteId}/ratings`), {
    user_id: auth.currentUser.uid,
    rating: rating,
    created_at: serverTimestamp(),
  });
};

/**
 * GET NOTE RATINGS
 */
export const getNoteRatings = async (noteId) => {
  const ratingsSnap = await getDocs(collection(db, `notes/${noteId}/ratings`));
  const ratings = ratingsSnap.docs.map((doc) => doc.data().rating);
  const average =
    ratings.length > 0 ? ratings.reduce((a, b) => a + b) / ratings.length : 0;
  return {
    average: Math.round(average * 10) / 10,
    count: ratings.length,
    userRating: null, // Would need to check if current user rated
  };
};

/**
 * REPORT NOTE
 */
export const reportNote = async (noteId, reason) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  await addDoc(collection(db, "reports"), {
    reporter_user_id: auth.currentUser.uid,
    content_id: noteId,
    content_type: "note",
    reason: reason,
    status: "pending",
    created_at: serverTimestamp(),
  });
};

/**
 * FETCH COURSES (HARDCODED)
 */
export const getCourses = async () => {
  return await getCoursesFromOnboarding();
};
