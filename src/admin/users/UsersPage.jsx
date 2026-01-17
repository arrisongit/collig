import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import UserRow from "./UserRow";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"));
      const snap = await getDocs(q);
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchUsers();
  }, []);

  return (
    <>
      <h2>Users</h2>
      {users.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </>
  );
}
