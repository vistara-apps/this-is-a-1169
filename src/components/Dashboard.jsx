import React from 'react'
import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react'
import { FeatureCard } from './FeatureCard'
import { useApp } from '../context/AppContext'

export function Dashboard() {
  const { state } = useApp()

  const stats = [
    {
      label: 'Business Models',
      value: state.businessModels.length,
      icon: BarChart3,
      color: 'text-accent'
    },
    {
      label: 'Simulations Run',
      value: state.simulations.length,
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      label: 'AI Credits Used',
      value: 5 - state.user.aiCredits,
      icon: DollarSign,
      color: 'text-yellow-400'
    },
    {
      label: 'Active Configs',
      value: state.businessModels.filter(m => m.isActive).length,
      icon: Users,
      color: 'text-green-400'
    }
  ]

  const features = [
    {
      title: 'Dynamic Pricing Engine',
      description: 'Simulate pricing strategies based on demand, user segments, and market conditions',
      highlighted: true
    },
    {
      title: 'Usage-Based Monetization',
      description: 'Model consumption-based pricing for APIs, data processing, and feature usage',
      highlighted: false
    },
    {
      title: 'AI Recommendations',
      description: 'Get personalized business model suggestions based on your preferences',
      highlighted: false
    },
    {
      title: 'Freemium Optimizer',
      description: 'Optimize feature gating and conversion paths for maximum user acquisition',
      highlighted: false
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to BizModel AI
        </h1>
        <p className="text-lg text-text-secondary leading-7">
          An AI-powered tool for solo founders to brainstorm, customize, and implement 
          dynamic business models and pricing strategies.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                  <p className="text-2xl font-semibold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              highlighted={feature.highlighted}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="button-primary">
            Create New Model
          </button>
          <button className="button-secondary">
            Run Simulation
          </button>
          <button className="button-secondary">
            Get AI Suggestions
          </button>
          <button className="button-secondary">
            Optimize Freemium
          </button>
        </div>
      </div>
    </div>
  )
}