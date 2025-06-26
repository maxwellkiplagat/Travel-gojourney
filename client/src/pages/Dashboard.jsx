import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    axios
      .get('/trips/my-posts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setTrips(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this trip?");
    if (!confirm) return;

    try {
      await axios.delete(`/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTrips(trips.filter((trip) => trip.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Trips</h1>
      {trips.length === 0 ? (
        <p>You have not posted any trips yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="border p-4 rounded shadow bg-white">
              <img
                src={trip.image_url}
                alt={trip.title}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-xl font-bold mt-2">{trip.title}</h2>
              <p className="text-gray-600">{trip.location}</p>
              <p className="text-gray-700 mt-2">{trip.description}</p>

              <div className="flex justify-end items-center gap-3 mt-4">
                <Link
                  to={`/edit-post/${trip.id}`}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Pencil size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;