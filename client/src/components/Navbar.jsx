import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, LogOut, Menu, X, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2 text-blue-600">
          <Compass className="h-8 w-8" /><span className="text-xl font-bold">GoJourney</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-600">Explore</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">My Posts</Link>
              <Link to="/new-post" className="bg-blue-600 text-white px-4 py-1 rounded">Share Experience</Link>
              <div className="relative">
                <button onClick={() => setOpen(!open)} className="flex items-center space-x-2">
                  <User /><span>{user.username}</span>
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 bg-white shadow rounded p-2">
                    <p className="text-sm">{user.email}</p>
                    {user.is_admin && <Link to="/admin" className="block py-1">Admin Panel</Link>}
                    <button onClick={() => {logout(); nav('/')}} className="w-full text-left py-1">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-1 rounded">Join GoJourney</Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <div className="md:hidden bg-white p-2 space-y-2">
        <Link to="/" className="block">Explore</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="block">My Posts</Link>
            <Link to="/new-post" className="block">Share Experience</Link>
            {user.is_admin && <Link to="/admin" className="block">Admin Panel</Link>}
            <button onClick={() => {logout(); nav('/')}} className="block w-full text-left">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="block">Login</Link>
            <Link to="/register" className="block">Join GoJourney</Link>
          </>
        )}
      </div>}
    </nav>
  );
}