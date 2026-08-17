import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, ShieldAlert, LogIn, UserPlus } from 'lucide-react'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            <Clock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1">
              Expiry<span className="text-primary">Manager</span>
            </span>
            <span className="text-xs font-semibold text-secondary tracking-widest uppercase">Smart Tracker</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#about" className="hover:text-primary transition-colors">Why Us</a>
        </nav>

        {/* Auth CTA Links */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:text-primary hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </Link>
        </div>

      </div>
    </header>
  )
}

export default Navbar
