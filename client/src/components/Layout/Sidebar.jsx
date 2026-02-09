import { TbLayoutDashboard } from "react-icons/tb";
import { FaUsers, FaUser, FaFlask, FaFileMedical } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { ROLES } from "../../utils/roles";

const allMenuItems = [
  {
    label: "Dashboard",
    icon: TbLayoutDashboard,
    path: "/dashboard",
    roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.LABORANT],
  },
  {
    label: "Patients",
    icon: FaUsers,
    path: "/patients",
    roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.LABORANT],
  },
  {
    label: "Test Results",
    icon: FaFileMedical,
    path: "/test-results",
    roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.LABORANT],
  },
  {
    label: "Tests",
    icon: FaFlask,
    path: "/tests",
    roles: [ROLES.ADMIN, ROLES.LABORANT],
  },

  {
    label: "Users",
    icon: FaUsers,
    path: "/users",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Profile",
    icon: FaUser,
    path: "/profile",
    roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.LABORANT],
  },
];

export default function Sidebar({ open, setOpen }) {
  const { logout } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const menu = allMenuItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <aside
      className={`
        fixed z-50 inset-y-0 left-0 w-64 h-screen bg-white flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-50/50">
        <div className="w-full flex items-center justify-center">
          <h1 className="text-3xl font-bold text-blue-500 tracking-tight text-center">
            medica
          </h1>
        </div>

        <button
          className="lg:hidden text-gray-500 hover:text-gray-700"
          onClick={() => setOpen(false)}
        >
          <IoClose size={24} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menu.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) => `
              flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-blue-500"
              }
            `}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="py-6 px-4 space-y-2">
        <button
          className="
              flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-200
              text-gray-500 hover:bg-gray-100 hover:text-blue-500"
          onClick={handleLogout}
        >
          <IoLogOutOutline size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
