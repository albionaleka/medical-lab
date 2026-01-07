import logo from "/logo.png";

const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-[90%] max-w-6xl">
      <div
        className="
        flex items-center justify-between
        px-6 py-3
        rounded-full
        bg-white/15
        backdrop-blur-xl
        border border-white/40
        shadow-lg
      "
      >
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Medica Logo"
            className="w-8 h-8 filter brightness-0"
          />
          <span className="text-lg font-semibold text-blue-900">Medica</span>
        </div>

        <a href="/login">
          <button
            className="
          px-5 py-2
          rounded-full
          text-sm font-medium
          text-blue-600
          bg-blue-200/60
          hover:bg-blue-100/60
          transition
        "
          >
            Login
          </button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
