import React from 'react'
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  Brain, 
  Zap,
  CreditCard
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pricing', label: 'Dynamic Pricing', icon: TrendingUp },
  { id: 'usage', label: 'Usage Modeling', icon: BarChart3 },
  { id: 'recommendations', label: 'AI Recommendations', icon: Brain },
  { id: 'freemium', label: 'Freemium Optimizer', icon: Zap },
]

export function SidebarNav({ activeSection, onSectionChange }) {
  const { state } = useApp()

  return (
    <div className="w-64 bg-surface border-r border-gray-700 h-screen flex flex-col">
      {/* Logo and Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">BizModel AI</h1>
        <p className="text-sm text-text-secondary mt-1">
          Dynamically adapt your business model
        </p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4 text-accent" />
          <span className="text-text-secondary">AI Credits:</span>
          <span className="font-medium text-accent">{state.user.aiCredits}</span>
        </div>
        <div className="text-xs text-text-secondary mt-1">
          {state.user.subscriptionTier === 'free' ? 'Free Tier' : 'Pro Tier'}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-text-secondary">
          © 2024 BizModel AI
        </div>
      </div>
    </div>
  )
}