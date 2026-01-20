import api from "../api/axios";
import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleEdit = (userId) => {
    const user = users.find((u) => u.id === userId);
    const profile = profiles[userId];
    if (user) {
      setEditingUser({ ...user, ...(profile || {}) });
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/auth/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/auth/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await api.get("/api/profile/all");
      const profilesData = {};
      response.data.forEach((profile) => {
        profilesData[profile.userId] = profile;
      });
      setProfiles(profilesData);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchProfiles()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUserCreated = () => {
    loadData();
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const profile = profiles[user.id];
    const name = profile
      ? `${profile.firstName} ${profile.lastName}`.toLowerCase()
      : "";
    const email = user.email.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="fit-content relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex md:items-end items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <FaPlus />
            <span>Add User</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 hidden md:table-header-group">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 block md:table-row-group">
                {filteredUsers.map((user) => {
                  const profile = profiles[user.id];
                  const createdDate = new Date(
                    user.created_at,
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors block md:table-row border-b md:border-b-0"
                    >
                      <td className="px-6 py-4 md:whitespace-nowrap text-sm text-gray-900 font-medium block md:table-cell flex justify-between md:block">
                        <span className="md:hidden font-semibold text-gray-500">ID:</span>
                        {user.id}
                      </td>
                      <td className="px-6 py-4 md:whitespace-nowrap text-sm text-gray-900 block md:table-cell flex justify-between md:block">
                        <span className="md:hidden font-semibold text-gray-500">Name:</span>
                        {profile ? (
                          `${profile.firstName} ${profile.lastName}`
                        ) : (
                          <span className="text-gray-400 italic">No Name</span>
                        )}
                      </td>
                      <td className="px-6 py-4 md:whitespace-nowrap text-sm text-gray-500 block md:table-cell flex justify-between md:block">
                        <span className="md:hidden font-semibold text-gray-500">Email:</span>
                        {user.email}
                      </td>
                      <td className="px-6 py-4 md:whitespace-nowrap text-sm text-gray-500 block md:table-cell flex justify-between md:block">
                        <span className="md:hidden font-semibold text-gray-500">Created:</span>
                        {createdDate}
                      </td>
                      <td className="px-6 py-4 md:whitespace-nowrap text-right text-sm font-medium block md:table-cell flex justify-between md:block items-center">
                        <span className="md:hidden font-semibold text-gray-500">Actions:</span>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center block md:table-cell">
                      <div className="flex flex-col items-center justify-center">
                        <FaSearch className="text-gray-300 text-4xl mb-3" />
                        <p className="text-gray-500 text-lg font-medium">
                          No users found
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredUsers.length}</span> of{" "}
            <span className="font-semibold">{users.length}</span> users
          </div>
        </div>
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleUserCreated}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={() => {
          loadData();
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
      />
    </>
  );
};

export default Users;
