import React, { useState, useEffect } from 'react';
import { User, Calendar, Eye, Shield, Trash } from 'lucide-react';
import axios from '../api/axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('trips');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalUsers: 0,
    recentTrips: 0,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, tripsRes] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/admin/trips')
      ]);

      setUsers(usersRes.data);
      setTrips(tripsRes.data);
      setStats({
        totalTrips: tripsRes.data.length,
        totalUsers: usersRes.data.length,
        recentTrips: tripsRes.data.slice(-5).length
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Delete this ${type}?`)) return;

    try {
      await axios.delete(`/admin/${type}/${id}`);
      type === 'users'
        ? setUsers((prev) => prev.filter((u) => u.id !== id))
        : setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(`${type} delete failed:`, err);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users and trips</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<Eye className="h-6 w-6 text-blue-600" />} title="Total Trips" count={stats.totalTrips} color="blue" />
          <StatCard icon={<User className="h-6 w-6 text-green-600" />} title="Total Users" count={stats.totalUsers} color="green" />
          <StatCard icon={<Calendar className="h-6 w-6 text-purple-600" />} title="Recent Trips" count={stats.recentTrips} color="purple" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <TabButton label="Trips" count={trips.length} active={activeTab === 'trips'} onClick={() => setActiveTab('trips')} />
              <TabButton label="Users" count={users.length} active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'trips' && (
              <TripTable trips={trips} onDelete={(id) => handleDelete(id, 'trips')} formatDate={formatDate} />
            )}

            {activeTab === 'users' && (
              <UserTable users={users} onDelete={(id) => handleDelete(id, 'users')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components

const TabButton = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`py-4 px-1 border-b-2 font-medium text-sm ${
      active ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {label} ({count})
  </button>
);

const StatCard = ({ icon, title, count, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center">
      <div className={`bg-${color}-100 p-3 rounded-lg`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{count}</p>
      </div>
    </div>
  </div>
);

const TableHeader = ({ label }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</th>
);

const TripTable = ({ trips, onDelete, formatDate }) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Trips</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader label="Title" />
            <TableHeader label="Location" />
            <TableHeader label="Author" />
            <TableHeader label="Likes" />
            <TableHeader label="Created" />
            <TableHeader label="Actions" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td className="px-6 py-4 text-sm text-gray-900">{trip.title}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{trip.location}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{trip.author_username}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{trip.likes}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(trip.created_at)}</td>
              <td className="px-6 py-4">
                <button onClick={() => onDelete(trip.id)} className="text-red-600 hover:text-red-800">
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
          {trips.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">No trips found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const UserTable = ({ users, onDelete }) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Users</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader label="Username" />
            <TableHeader label="Email" />
            <TableHeader label="Role" />
            <TableHeader label="Actions" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.is_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.is_admin ? 'Admin' : 'User'}
                </span>
              </td>
              <td className="px-6 py-4">
                <button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-800">
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;
