import React from 'react'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Expiry<span className="text-primary">Manager</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} Expiry Date Manager. All rights reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer
