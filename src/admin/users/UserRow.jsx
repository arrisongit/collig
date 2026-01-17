import { assignUserUniversityAndRole } from "../../services/adminNotes.service";

export default function UserRow({ user }) {
  return (
    <div>
      <span>{user.full_name}</span>
      <span>{user.role}</span>

      <button
        onClick={() =>
          assignUserUniversityAndRole({
            targetUserId: user.uid,
            university_id: user.university_id,
            role: "admin",
          })
        }
      >
        Make Admin
      </button>
    </div>
  );
}
