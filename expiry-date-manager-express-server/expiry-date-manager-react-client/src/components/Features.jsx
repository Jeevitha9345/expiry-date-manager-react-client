import React from 'react'
import { Clock, ShieldAlert, Layers, TrendingDown, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: 'Automated Reminders',
    description: 'Set custom warning windows and receive notifications days or weeks before products spoil.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Layers,
    title: 'Smart Categorization',
    description: 'Group items by Groceries, Medications, Household supplies, Cosmetics, and Custom Categories.',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    icon: TrendingDown,
    title: 'Waste Reduction & Savings',
    description: 'Reduce household waste by up to 40% by consuming items before they cross expiration dates.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: ShieldAlert,
    title: 'Role & Admin Management',
    description: 'Secure multi-user support with roles for individual users and team/admin management.',
    color: 'bg-purple-100 text-purple-600',
  },
]

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Designed to Keep You <span className="text-primary">Organized & Ahead</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Everything you need to eliminate forgotten items, manage inventory, and keep your household running smoothly.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Fully Integrated</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default Features
