import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Heart, MapPin, FileText, Image } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    axios.get(`/trips/${id}`)
      .then(res => setTrip(res.data))
      .catch(() => navigate('/'));
  }, [id, navigate]);

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">
        &larr; Back
      </button>

      <img src={trip.image_url} alt={trip.title} className="w-full h-64 object-cover rounded" />

      <div className="mt-6 space-y-4">
        <h1 className="text-3xl font-bold">{trip.title}</h1>
        <div className="flex items-center space-x-4 text-gray-600">
          <MapPin /> <span>{trip.location}</span>
          <Heart /> <span>{trip.likes} likes</span>
        </div>
        <p className="text-gray-800 mt-4">{trip.description}</p>
      </div>
    </div>
  );
};

export default PostDetail;