import { TbLayoutDashboard } from "react-icons/tb";
import { FaUsers, FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

const menu = [
  { label: "Dashboard", icon: TbLayoutDashboard, path: "/dashboard" },
  { label: "Patients", icon: FaUsers, path: "/patients" },
  { label: "Users", icon: FaUser, path: "/users" },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <aside
      className={`
        fixed z-50 inset-y-0 left-0 w-64 bg-white flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static
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
        <NavLink
          key="logout"
          to="/logout"
          className="
              flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-200
              text-gray-500 hover:bg-gray-100 hover:text-blue-500"
        >
          <IoLogOutOutline size={20} />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}
