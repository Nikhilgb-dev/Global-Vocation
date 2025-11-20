import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import API from "../api/api";
import logo from "../assets/logo.jpg";
import { Bell, User, LogOut, Settings, Briefcase, Users, LayoutDashboard, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const helpModalRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 🔹 Fetch user details and notifications
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await API.get("/users/me");
        setUser(res.data);
        await fetchNotifications();
        if (res.data.role === "company_admin") {
          fetchCompanyRemarks();
        }
      } catch {
        setUser(null);
      }
    }
  };

  // 🔹 Existing general notifications
  // const fetchNotifications = async () => {
  //   try {
  //     const res = await API.get("/notifications");
  //     setNotifications(res.data || []);
  //   } catch (err) {
  //     console.error("Failed to fetch notifications", err);
  //   }
  // };

  const fetchNotifications = async () => {
    try {
      // Base notifications (job-related)
      const [notifRes, remarksRes] = await Promise.allSettled([
        API.get("/notifications"),
        user?.role === "company_admin" ? API.get("/companies/me/remarks") : null,
      ]);

      let baseNotifications = [];
      if (notifRes.status === "fulfilled") {
        baseNotifications = notifRes.value.data || [];
      }

      let remarkNotifications = [];
      if (
        user?.role === "company_admin" &&
        remarksRes.status === "fulfilled" &&
        remarksRes.value?.data?.remarksHistory
      ) {
        const remarks = remarksRes.value.data.remarksHistory;
        remarkNotifications = remarks.map((r: any) => ({
          _id: `remark-${r._id || Math.random().toString(36).substring(2)}`,
          message: `📝 Admin Remark: ${r.text}`,
          createdAt: r.date,
          isRead: false,
          type: "remark",
        }));
      }

      // Merge both (remarks first, then others)
      const merged = [...remarkNotifications, ...baseNotifications];

      // Deduplicate by message text
      const unique = Array.from(new Map(merged.map((n) => [n.message, n])).values());

      // Sort newest first
      unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNotifications(unique);
    } catch (err) {
      console.error("Failed to fetch notifications or remarks", err);
    }
  };


  // 🔹 New: Fetch company remarks for company_admin users
  const fetchCompanyRemarks = async () => {
    try {
      const res = await API.get("/companies/me/remarks");
      const remarks = res.data.remarksHistory || [];

      const formattedRemarks = remarks.map((r: any) => ({
        _id: `remark-${r._id || Math.random().toString(36).substring(2)}`,
        message: `📝 Admin Remark: ${r.text}`,
        createdAt: r.date,
        isRead: false,
        type: "remark",
      }));

      // Merge remarks with other notifications and deduplicate
      setNotifications((prev) => {
        const merged = [...formattedRemarks, ...prev];
        const unique = Array.from(new Map(merged.map((n) => [n.message, n])).values());
        return unique.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    } catch (err) {
      console.error("Failed to fetch company remarks", err);
    }
  };

  const markAsRead = async (id: string) => {
    if (id.startsWith("remark-")) {
      // remarks are read-only, don’t need API call
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      return;
    }
    await API.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  // 🔹 Initial load
  useEffect(() => {
    fetchUser();
    window.addEventListener("auth-change", fetchUser);
    return () => window.removeEventListener("auth-change", fetchUser);
  }, []);

  // 🔹 Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (helpModalRef.current && !helpModalRef.current.contains(event.target as Node)) {
        setShowHelpModal(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Auto-refresh company remarks every 60s for live updates
  useEffect(() => {
    if (user?.role === "company_admin") {
      const interval = setInterval(fetchCompanyRemarks, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

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
    <header className="sticky p-1.5 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="relative">
                <img
                  src={logo}
                  alt="Plabonic"
                  className="h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
                <span className="absolute -top-1 -right-8 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  Beta
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/jobs" className={navLinkClass}>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Jobs</span>
                </div>
              </NavLink>
              <NavLink to="/freelancers" className={navLinkClass}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Freelancers</span>
                </div>
              </NavLink>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Get Help Button */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Get Help
            </button>


            {user ? (
              <>
                {/* Dashboard Button */}
                {dashboardLink && (
                  <Link
                    to={dashboardLink.to}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

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
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${n.isRead ? "bg-white" : n.type === "remark"
                                  ? "bg-yellow-50/60"
                                  : "bg-blue-50/50"
                                  }`}
                              >
                                <div className="flex gap-3">
                                  <div
                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.isRead ? "bg-gray-300" : n.type === "remark"
                                      ? "bg-yellow-400"
                                      : "bg-blue-500"
                                      }`}
                                  />
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
                          <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
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

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              // Login and Signup buttons commented out for logged out state
              null
            )}
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Nav Links */}
              <nav className="space-y-2">
                <NavLink
                  to="/jobs"
                  onClick={() => setIsMobileMenuOpen(false)}
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
                  onClick={() => setIsMobileMenuOpen(false)}
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
              </nav>

              {/* Mobile Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowHelpModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>Get Help</span>
                </button>

                {dashboardLink && (
                  <NavLink
                    to={dashboardLink.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>{dashboardLink.label}</span>
                  </NavLink>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-60"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              ref={helpModalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Get Help</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value="Raghav Naidu"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value="Plabonic.hq@gmail.com"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value="+91-8310242649"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
