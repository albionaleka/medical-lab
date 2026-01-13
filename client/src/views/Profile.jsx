import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";
import {
  FaCamera,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    address: "",
    phone: "",
    jobTitle: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;
        const { data } = await api.get(`/api/profile?id=${user.id}`);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          birthday: data.birthday || "",
          address: data.address || "",
          phone: data.phone || "",
          jobTitle: data.jobTitle || "",
          profileImage: data.profileImage || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthday: formData.birthday,
        address: formData.address,
        phone: formData.phone,
        jobTitle: formData.jobTitle,
        profileImage: formData.profileImage,
      };
      await api.post("/api/profile", payload);
      toast.success("Profile saved successfully");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Profile">
      <section className="max-w-3xl w-full">
        <form onSubmit={handleSave} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group mx-auto md:mx-0">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg bg-gray-100">
                <img
                  src={formData.profileImage || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 rounded-full bg-blue-600 p-2 text-white shadow-md hover:bg-blue-700 transition-colors"
                title="Change Photo"
              >
                <FaCamera size={14} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 font-semibold mb-1">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 bg-gray-50 text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-semibold mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 bg-gray-50 text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-semibold mb-1 flex items-center gap-1"><FaCalendarAlt /> Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday ? formData.birthday.substring(0,10) : ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 bg-gray-50 text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-semibold mb-1 flex items-center gap-1"><FaBriefcase /> Job Title</label>
                <input
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 bg-gray-50 text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  placeholder="e.g. Lab Technician"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-semibold mb-1 flex items-center gap-1"><FaPhone /> Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 bg-gray-50 text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  placeholder="e.g. +1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-semibold mb-1 flex items-center gap-1"><FaMapMarkerAlt /> Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 bg-gray-50 text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  placeholder="Full street address"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-10">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-10 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default Profile;

