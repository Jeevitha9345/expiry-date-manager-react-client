import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, LogIn, UserPlus, LayoutDashboard } from 'lucide-react'
import { getCurrentUser } from '../services/authService'

const Navbar = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser()
      setUser(u)
    }
    fetchUser()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            <Clock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1">
              Expiry<span className="text-amber-500">Manager</span>
            </span>
            <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Smart Tracker</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
          {user && (
            <Link to="/dashboard" className="hover:text-amber-500 transition-colors font-bold text-amber-600">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth CTA Links */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/25"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:text-amber-500 hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/25"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  )
}

export default Navbar
