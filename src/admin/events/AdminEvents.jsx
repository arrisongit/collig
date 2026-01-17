import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function AdminEvents() {
  const createEvent = async () => {
    await addDoc(collection(db, "events"), {
      title: "Orientation",
      visibility: "school_only",
      university_id: "UNIVERSITY_ID",
      date: new Date(),
    });
  };

  return <button onClick={createEvent}>Create Event</button>;
}
