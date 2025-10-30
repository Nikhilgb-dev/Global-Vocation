import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import API from "../api/api";
import logo from "../assets/logo.jpg";
import { Bell, Menu, X, User, LogOut, Settings, Briefcase, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowUserMenu(false);
    navigate("/login");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
      ? "text-blue-600 bg-blue-50"
      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
    }`;

  const getDashboardLink = () => {
    if (user?.role === "admin") return { to: "/dashboard", label: "Admin Dashboard" };
    if (user?.role === "company_admin") return { to: "/company/dashboard", label: "Company Dashboard" };
    if (user?.role === "user") return { to: "/user/dashboard", label: "Dashboard" };
    return null;
  };

  const dashboardLink = getDashboardLink();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="relative">
              <img
                src={logo}
                alt="Global Vocation"
                className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            <NavLink to="/jobs" className={navLinkClass}>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
              </div>
            </NavLink>
            <NavLink to="/freelancers" className={navLinkClass}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Freelancers</span>
              </div>
            </NavLink>

            {dashboardLink && (
              <NavLink to={dashboardLink.to} className={navLinkClass}>
                {dashboardLink.label}
              </NavLink>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </motion.span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                          <h3 className="font-semibold text-gray-800 flex items-center justify-between">
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                {unreadCount} new
                              </span>
                            )}
                          </h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 text-sm">No notifications yet</p>
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <motion.div
                                key={n._id}
                                whileHover={{ backgroundColor: "rgb(249, 250, 251)" }}
                                onClick={() => markAsRead(n._id)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${n.isRead ? "bg-white" : "bg-blue-50/50"
                                  }`}
                              >
                                <div className="flex gap-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.isRead ? "bg-gray-300" : "bg-blue-500"
                                    }`} />
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                      {n.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(n.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <img
                      src={user.profilePhoto || "https://via.placeholder.com/40"}
                      alt="profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
                    />
                    <span className="font-medium text-gray-800 text-sm max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <NavLink
                            to="/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </NavLink>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Nav Links */}
              <NavLink
                to="/jobs"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <Briefcase className="w-5 h-5" />
                <span>Jobs</span>
              </NavLink>

              <NavLink
                to="/freelancers"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <Users className="w-5 h-5" />
                <span>Freelancers</span>
              </NavLink>

              {dashboardLink && (
                <NavLink
                  to={dashboardLink.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {dashboardLink.label}
                </NavLink>
              )}

              {/* User Section */}
              {user ? (
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img
                      src={user.profilePhoto || "https://via.placeholder.com/40"}
                      alt="profile"
                      className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="px-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center">
                          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">No notifications</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => markAsRead(n._id)}
                            className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${n.isRead ? "bg-white hover:bg-gray-50" : "bg-blue-50/50 hover:bg-blue-50"
                              }`}
                          >
                            <div className="flex gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? "bg-gray-300" : "bg-blue-500"
                                }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-800 leading-relaxed">
                                  {n.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1">
                    <NavLink
                      to="/settings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-center text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                  >
                    Sign up
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}