import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-brand" : "text-gray-700 hover:text-brand"
    }`;

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        API.get("/users/me")
          .then((res) => setUser(res.data))
          .catch(() => setUser(null));
      }
    };

    fetchUser(); // Initial fetch

    window.addEventListener("auth-change", fetchUser); // Refetch on auth change

    return () => {
      window.removeEventListener("auth-change", fetchUser); // Cleanup
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/jobs" className={linkClass}>
              Jobs
            </NavLink>
            <NavLink to="/companies" className={linkClass}>
              Companies
            </NavLink>
            <NavLink to="/pricing" className={linkClass}>
              Pricing
            </NavLink>

            {/* Only admin and employer can see this */}
            {(user?.role === "admin" || user?.role === "employer") && (
              <NavLink to="/post-job" className={linkClass}>
                Post a Job
              </NavLink>
            )}

          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePhoto || "https://via.placeholder.com/40"}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
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
