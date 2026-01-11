import { FaUser, FaSearch } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

export default function Header({ onMenuClick, title }) {
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

      <button className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
          <FaUser size={20} />
        </div>
      </button>
    </header>
  );
}
