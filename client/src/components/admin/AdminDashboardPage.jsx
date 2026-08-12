import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import SlotManager from "../../components/admin/SlotManager";
import BookingsTable from "../../components/admin/BookingsTable";
import ClassManager from "../../components/admin/ClassManager";

export default function AdminDashboardPage() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-heading font-bold text-3xl text-slate">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-text-muted hover:text-slate"
        >
          Log out
        </button>
      </div>

      <div className="space-y-8">
        <SlotManager />
        <BookingsTable />
        <ClassManager />
      </div>
    </div>
  );
}