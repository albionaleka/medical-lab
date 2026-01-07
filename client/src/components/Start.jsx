import laboratory from "../assets/hero.png";
import { GiTestTubes } from "react-icons/gi";

const Main = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f5f7ff] via-white to-[#eef2ff] flex items-center">
      <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center align-middle gap-2 mb-4">
            <GiTestTubes size={20} className="text-blue-600" />
            <p className="text-sm text-blue-600 font-medium">
              Perfect for medical laboratories
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-indigo-900 leading-tight mb-6">
            Streamline Your <br />
            Medical Lab <br />
            with Ease
          </h1>

          <p className="text-slate-600 max-w-xl mb-8">
            Manage laboratory tests, patient records, and medical results
            through a secure and modern platform - designed for accuracy and
            efficiency.
          </p>

          <a href="/login">
            <button className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-indigo-700 transition">
              Get Started
            </button>
          </a>
        </div>

        <div className="relative flex justify-center hero-image">
          <div className="w-80 h-80 md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-tr from-pink-200 via-indigo-200 to-blue-200 flex items-center justify-center shadow-xl">
            <img
              src={laboratory}
              alt="Medical Illustration"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
