import { FaUser } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { useState } from "react";

export default function Header({ onMenuClick, title }) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <header className="h-20 bg-transparent px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-gray-500 hover:text-gray-700"
          onClick={onMenuClick}
        >
          <FiMenu size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 hidden sm:block">
          {title || "Dashboard"}
        </h2>
      </div>

      <button
        className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        onClick={() => setPopoverOpen(!popoverOpen)}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
          <FaUser size={20} />
        </div>
      </button>
      {popoverOpen && (
        <div className="absolute top-18 right-8 bg-white border border-gray-200 rounded-lg shadow-lg w-48">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200">
                <FaUser size={15} />
              </div>
              <div>
                <p className="text-gray-800 text-sm font-medium">User Name</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <p className="text-gray-500 text-xs">Role</p>
                </div>
              </div>
            </div>
          </div>
          <ul className="py-2">
            <li>
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
              >
                <FaUser className="inline mr-2" />
                Profile
              </a>
            </li>

            <li>
              <a
                href="/logout"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-500"
              >
                <IoLogOutOutline className="inline mr-2" />
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
