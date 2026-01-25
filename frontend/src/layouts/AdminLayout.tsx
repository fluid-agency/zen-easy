import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin")as string);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-56 min-h-screen bg-gray-50 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
