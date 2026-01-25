import { useState } from "react";
import {
  Home,
  Users,
  Briefcase,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/admin/overview" },
    { id: "users", label: "Users", icon: Users, path: "/admin/users" },
    {
      id: "prof-services",
      label: "Professional Services",
      icon: Briefcase,
      path: "/admin/prof-services",
    },
    { id: "rent", label: "Rent Properties", icon: Building2, path: "/admin/rents" },
  ];

  const activeTab = menuItems.find((item) =>
    location.pathname.startsWith(item.path)
  )?.id;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogOut = () =>{
    localStorage.removeItem('isAdmin');
    navigate('/auth/login');
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200  z-40
          transition-all duration-300
          ${isCollapsed ? "w-20" : ""}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold">Admin Panel</h2>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block"
          >
            <ChevronLeft
              className={`transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
      <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-white via-white to-transparent border-t border-gray-200/80 backdrop-blur-sm">
  <div className="space-y-2">
    {/* Settings Button */}
    <button 
      className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl 
                 bg-white border border-gray-200/60
                 hover:border-gray-300 hover:bg-gray-50/80
                 transition-all duration-300 ease-in-out
                 hover:shadow-md hover:shadow-gray-200/50
                 active:scale-[0.98]"
    >
      <div className="relative">
        <Settings className="w-5 h-5 text-gray-600 group-hover:text-gray-800 
                           transition-all duration-300 group-hover:rotate-90" />
        <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-md 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {!isCollapsed && (
        <span className="font-medium text-gray-700 group-hover:text-gray-900 
                       transition-colors duration-300">
          Settings
        </span>
      )}
    </button>

    {/* Logout Button */}
    <button 
      onClick={() => handleLogOut()} 
      className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl 
                 bg-red-50/50 border border-red-200/60
                 hover:bg-red-100/80 hover:border-red-300
                 transition-all duration-300 ease-in-out
                 hover:shadow-md hover:shadow-red-200/50
                 active:scale-[0.98]"
    >
      <div className="relative">
        <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 
                         transition-all duration-300 group-hover:translate-x-0.5" />
        <div className="absolute inset-0 bg-red-400/20 rounded-full blur-md 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {!isCollapsed && (
        <span className="font-medium text-red-600 group-hover:text-red-700 
                       transition-colors duration-300">
          Logout
        </span>
      )}
    </button>
  </div>
</div>
      </aside>
    </>
  );
};

export default AdminSidebar;
