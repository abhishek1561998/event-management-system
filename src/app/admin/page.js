import EventForm from "../components/EventForm.js";
import { getCurrentUser } from "../../lib/auth.js";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user.is_admin) {
    return <div style={{ color: "#dc2626" }}>Access denied. Admins only.</div>;
  }

  return (
    <div>
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}
      >
        Admin Dashboard
      </h1>
      <EventForm userId={user.id} />
    </div>
  );
}
