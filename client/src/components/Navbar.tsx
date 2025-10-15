import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/api";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await API.get("/users/me");
        setUser(res.data);
        fetchNotifications();
      } catch {
        setUser(null);
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id: string) => {
    await API.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener("auth-change", fetchUser);
    return () => window.removeEventListener("auth-change", fetchUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="container-xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-brand"></div>
            <span className="text-xl font-bold">
              Hirist<span className="text-brand">Tech</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/jobs" className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-brand" : "text-gray-700 hover:text-brand"
              }`
            }>
              Jobs
            </NavLink>
            <NavLink to="/companies" className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-brand" : "text-gray-700 hover:text-brand"
              }`
            }>
              Companies
            </NavLink>

            {/* Dashboards */}
            {user?.role === "admin" && (
              <NavLink to="/dashboard" className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-brand" : "text-gray-700 hover:text-brand"
                }`
              }>
                Admin Dashboard
              </NavLink>
            )}

            {user?.role === "company_admin" && (
              <NavLink to="/company/dashboard" className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-brand" : "text-gray-700 hover:text-brand"
                }`
              }>
                Company Dashboard
              </NavLink>
            )}

            {user?.role === "user" && (
              <NavLink to="/user/dashboard" className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-brand" : "text-gray-700 hover:text-brand"
                }`
              }>
                Dashboard
              </NavLink>
            )}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Bell Icon */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications((prev) => !prev)}
                    className="relative p-2 rounded-full hover:bg-gray-100"
                  >
                    <Bell className="w-6 h-6 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-3 w-80 bg-white border rounded-lg shadow-lg z-50"
                      >
                        <div className="p-3 border-b font-semibold text-gray-700">
                          Notifications
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 && (
                            <div className="p-3 text-gray-500 text-sm text-center">
                              No notifications yet
                            </div>
                          )}
                          {notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => markAsRead(n._id)}
                              className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${n.isRead ? "bg-white" : "bg-blue-50"
                                }`}
                            >
                              <div className="text-sm text-gray-800">
                                {n.message}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(n.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile + Logout */}
                <img
                  src={user.profilePhoto || "https://via.placeholder.com/40"}
                  alt="profile"
                  className="w-8 h-8 rounded-full border"
                />
                <span className="font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-sm text-gray-700 hover:text-brand"
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-3 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-dark"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
