import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaEnvelope,
  FaUserCircle,
  FaArrowLeft,
  FaShieldAlt,
  FaEdit,
  FaCamera,
} from "react-icons/fa";
import EditUserModal from "../components/EditUserModal";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isEditProfileMode, setIsEditProfileMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const fileInputRef = useRef(null);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersResponse = await api.get("/api/auth/");
      const user = usersResponse.data.find((u) => u.id === parseInt(id));

      if (!user) {
        setError("User not found");
        setLoading(false);
        return;
      }

      setUserData(user);

      try {
        const profileResponse = await api.get(`/api/profile?id=${id}`);
        setProfileData(profileResponse.data);
      } catch (profileError) {
        console.log("No profile found for user");
        setProfileData(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const handleEditProfile = () => {
    setIsEditProfileMode(true);
    setEditedProfile({
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      birthday: profileData?.birthday || "",
      address: profileData?.address || "",
      phone: profileData?.phone || "",
      jobTitle: profileData?.jobTitle || "",
      profileImage: profileData?.profileImage || "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditProfileMode(false);
    setEditedProfile({});
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const payload = {
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        birthday: editedProfile.birthday || null,
        address: editedProfile.address,
        phone: editedProfile.phone,
        jobTitle: editedProfile.jobTitle,
        profileImage: editedProfile.profileImage || "",
      };

      await api.put(`/api/profile/${id}`, payload);
      toast.success("Profile updated successfully");
      await fetchUserProfile();
      setIsEditProfileMode(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "DOCTOR":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "LABORANT":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <Layout title="User Profile">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !userData) {
    return (
      <Layout title="User Profile">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">
              {error || "User not found"}
            </p>
            <button
              onClick={() => navigate("/users")}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="User Profile">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/users")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Users</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditUserModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <FaEdit />
              <span>Edit User</span>
            </button>
            {!isEditProfileMode ? (
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
                >
                  Save Profile
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="relative">
            <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
              {(isEditProfileMode && editedProfile.profileImage) ||
              profileData?.profileImage ? (
                <img
                  src={
                    isEditProfileMode
                      ? editedProfile.profileImage
                      : profileData.profileImage
                  }
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <FaUserCircle className="text-white text-7xl" />
                </div>
              )}
            </div>
            {isEditProfileMode && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  title="Upload Photo"
                >
                  <FaCamera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
            {isEditProfileMode ? (
              <div className="flex gap-3 justify-center md:justify-start">
                <input
                  type="text"
                  name="firstName"
                  value={editedProfile.firstName}
                  onChange={handleProfileChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={editedProfile.lastName}
                  onChange={handleProfileChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
                  placeholder="Last Name"
                />
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">
                {profileData?.firstName && profileData?.lastName
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : "No Name Set"}
              </h1>
            )}
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(
                  userData.role,
                )}`}
              >
                <FaShieldAlt />
                {userData.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaPhone className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone</p>
                  {isEditProfileMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedProfile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData?.phone || (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Address</p>
                  {isEditProfileMode ? (
                    <input
                      type="text"
                      name="address"
                      value={editedProfile.address}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter address"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData?.address || (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Professional Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaBriefcase className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Job Title</p>
                  {isEditProfileMode ? (
                    <input
                      type="text"
                      name="jobTitle"
                      value={editedProfile.jobTitle}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter job title"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData?.jobTitle || (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Birthday</p>
                  {isEditProfileMode ? (
                    <input
                      type="date"
                      name="birthday"
                      value={
                        editedProfile.birthday
                          ? editedProfile.birthday.split("T")[0]
                          : ""
                      }
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData?.birthday ? (
                        new Date(profileData.birthday).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      ) : (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(userData.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!profileData && !isEditProfileMode && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">
              This user hasn't completed their profile yet
            </p>
          </div>
        )}
      </div>

      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        onSuccess={async () => {
          await fetchUserProfile();
          setIsEditUserModalOpen(false);
        }}
        user={userData}
      />
    </Layout>
  );
};

export default UserProfile;
