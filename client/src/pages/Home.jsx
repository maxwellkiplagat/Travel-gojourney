import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Compass, Search, Calendar } from 'lucide-react';

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/trips')
      .then((res) => setTrips(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleLike = async (tripId) => {
    try {
      const res = await axios.post(`/trips/${tripId}/like`);
      setTrips(prev =>
        prev.map(trip =>
          trip.id === tripId
            ? { ...trip, is_liked: res.data.liked, like_count: res.data.like_count }
            : trip
        )
      );
    } catch (err) {
      console.error("Like error", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const tripsSection = document.getElementById('trips-section');
    if (tripsSection) {
      tripsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredTrips = trips.filter(trip =>
    trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Compass className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Discover Amazing Travel Experiences
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Share your adventures, discover hidden gems, and get inspired by fellow travelers from around the world.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations, experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      <div id="trips-section" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Explore Trips</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition duration-200 overflow-hidden"
              >
                <Link to={`/trips/${trip.id}`}>
                  <img
                    src={trip.image_url}
                    alt={trip.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className="p-4">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                      @{trip.author_username}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(trip.created_at)}</span>
                    </div>
                  </div>

                  <Link to={`/trips/${trip.id}`}>
                    <h2 className="text-lg font-bold mt-2">{trip.title}</h2>
                  </Link>

                  <p className="text-gray-600 mb-4 line-clamp-3">{trip.description}</p>

                  <div className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                    <MapPin size={14} /> {trip.location}
                  </div>

                  <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                    <span>{trip.like_count} likes</span>
                    <button
                      onClick={() => toggleLike(trip.id)}
                      className="hover:scale-110 transition"
                      aria-label="like"
                    >
                      <Heart
                        size={18}
                        className={trip.is_liked ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No trips found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;


