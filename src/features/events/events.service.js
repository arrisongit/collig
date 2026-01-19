import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

export const uploadEvent = async (payload) => {
  return await addDoc(collection(db, "events"), {
    ...payload,
    status: "pending",
    created_at: serverTimestamp(),
  });
};

export default {
  uploadEvent,
};
