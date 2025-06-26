import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Trash } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchTrips();
  }, []);

  const fetchUsers = () => {
    axios.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Users fetch error:", err));
  };

  const fetchTrips = () => {
    axios.get('/admin/trips')
      .then(res => setTrips(res.data))
      .catch(err => console.error("Trips fetch error:", err));
  };

  const deleteUser = (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    axios.delete(`/admin/users/${id}`)
      .then(() => {
        fetchUsers();
        alert("User deleted");
      })
      .catch(err => console.error("Delete user error:", err));
  };

  const deleteTrip = (id) => {
    if (!confirm("Delete this trip?")) return;

    axios.delete(`/admin/trips/${id}`)
      .then(() => {
        fetchTrips();
        alert("Trip deleted");
      })
      .catch(err => console.error("Delete trip error:", err));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      {/* TRIPS SECTION */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-2">All Trips</h3>
        <div className="overflow-x-auto">
          <table className="w-full border shadow bg-white rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Likes</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id} className="border-t text-sm">
                  <td className="px-4 py-2">{trip.title}</td>
                  <td className="px-4 py-2">{trip.location}</td>
                  <td className="px-4 py-2">{trip.author_username}</td>
                  <td className="px-4 py-2">{trip.likes}</td>
                  <td className="px-4 py-2">{new Date(trip.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => deleteTrip(trip.id)} className="text-red-600 hover:text-red-800">
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr><td colSpan="6" className="text-center py-4 text-gray-500">No trips found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* USERS SECTION */}
      <section>
        <h3 className="text-xl font-semibold mb-2">All Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full border shadow bg-white rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t text-sm">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.is_admin ? "Admin" : "User"}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800">
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="4" className="text-center py-4 text-gray-500">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;