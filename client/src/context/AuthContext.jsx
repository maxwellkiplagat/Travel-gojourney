// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import * as jwtDecode from 'jwt-decode';

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount: look for token, decode it (to get userId), then fetch /auth/profile
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const { sub: id } = jwtDecode(token)
        api.get(`/auth/profile`)          // you need a GET /auth/profile endpoint returning { id, username, email, is_admin }
          .then(res => setUser(res.data))
          .catch(() => {
            localStorage.removeItem('token')
          })
          .finally(() => setLoading(false))
      } catch {
        localStorage.removeItem('token')
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    // assume backend returns { token, user: { id, username, email, is_admin } }
    setUser(res.data.user)
  }

  const register = async ({ username, email, password }) => {
    const res = await api.post('/auth/signup', { username, email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// hook to use in components:
export function useAuth() {
  return useContext(AuthContext)
}