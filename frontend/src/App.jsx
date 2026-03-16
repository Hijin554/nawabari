import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/users/${editingId}`, formData);
        alert('User updated successfully');
      } else {
        await axios.post(`${API_URL}/users`, formData);
        alert('User created successfully');
      }
      setFormData({ name: '', email: '' });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/users/${id}`);
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ name: '', email: '' });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          User Management System
        </h1>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            {editingId ? 'Edit User' : 'Add New User'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter email"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                {editingId ? 'Update User' : 'Add User'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Users List</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No users found. Add one above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.id}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.name}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
