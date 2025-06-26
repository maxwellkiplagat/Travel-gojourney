// src/components/PostCard.jsx

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Calendar, User, Edit, Trash2 } from 'lucide-react'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function PostCard({
  post,
  onPostUpdate,      // optional callback after edit/delete
  showActions = false
}) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likeCount, setLikeCount] = useState(post.like_count || 0)
  const [deleting, setDeleting] = useState(false)

  const toggleLike = async (e) => {
    e.preventDefault()
    if (!user) {
      window.location.href = '/login'
      return
    }
    try {
      if (isLiked) {
        await axios.delete(`/trips/${post.id}/like`)
        setLikeCount(likeCount - 1)
      } else {
        await axios.post(`/trips/${post.id}/like`)
        setLikeCount(likeCount + 1)
      }
      setIsLiked(!isLiked)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!window.confirm('Delete this trip?')) return
    setDeleting(true)
    try {
      await axios.delete(`/trips/${post.id}`)
      if (onPostUpdate) onPostUpdate()
    } catch (err) {
      console.error(err)
      setDeleting(false)
    }
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString()

  return (
    <Link to={`/trips/${post.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition p-0 overflow-hidden">
      <div className="relative">
        <img
          src={post.image_url || 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg'}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={toggleLike}
          className={`
            absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80
            ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}
          `}
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">{post.title}</h3>
        <p className="text-gray-600 line-clamp-2">{post.description}</p>

        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" /> {post.location}
          </span>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" /> {formattedDate}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1" /> {post.author_username}
          </span>
          <span className="flex items-center">
            <Heart className="h-4 w-4 mr-1" /> {likeCount}
          </span>
        </div>

        {showActions && user && (user.id === post.author_id || user.is_admin) && (
          <div className="flex justify-end space-x-3 mt-2">
            {user.id === post.author_id && (
              <Link
                to={`/edit-trip/${post.id}`}
                onClick={e => e.stopPropagation()}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </Link>
  )
}