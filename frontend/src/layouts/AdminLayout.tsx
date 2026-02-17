import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  //get token from cookies
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("admin_token="))
    ?.split("=")[1];
  
  if(!token){
    return <Navigate to="/admin/login" replace />
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
