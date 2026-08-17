import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bell, ShieldCheck, Calendar, Sparkles } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white py-20 lg:py-28">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-primary text-xs font-semibold tracking-wide uppercase shadow-xs">
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            <span>Smart Product & Expiry Tracker</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
            Never Let Your Supplies & Food <span className="bg-gradient-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent">Expire Unnoticed</span>
          </h1>

          {/* Sub-heading */}
          <p className="text-lg sm:text-xl text-gray-600 font-normal leading-relaxed">
            Take full control of your pantry, medicine cabinet, and inventory. Track expiry dates effortlessly, get automated alerts, and eliminate unnecessary waste.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm transition-all"
            >
              <span>Sign In to Account</span>
            </Link>
          </div>

          {/* Trust Badges / Quick Stats */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-gray-100 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-gray-100 shadow-xs">
              <div className="p-2.5 rounded-lg bg-blue-100 text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Instant Alerts</p>
                <p className="text-xs text-gray-500">Notifications before expiry</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-gray-100 shadow-xs">
              <div className="p-2.5 rounded-lg bg-orange-100 text-secondary">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Batch Manager</p>
                <p className="text-xs text-gray-500">Organize by categories</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-gray-100 shadow-xs">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Zero Waste</p>
                <p className="text-xs text-gray-500">Save money & resources</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
