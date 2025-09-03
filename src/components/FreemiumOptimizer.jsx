import React, { useState } from 'react'
import { Zap, Users, TrendingUp, Lock, Unlock } from 'lucide-react'

export function FreemiumOptimizer() {
  const [freemiumConfig, setFreemiumConfig] = useState({
    freeFeatures: [],
    paidFeatures: [],
    conversionGoal: 'trial'
  })

  const [optimization, setOptimization] = useState(null)

  const allFeatures = [
    { id: 'basic-analytics', name: 'Basic Analytics', category: 'analytics', complexity: 'low' },
    { id: 'advanced-reports', name: 'Advanced Reports', category: 'analytics', complexity: 'high' },
    { id: 'user-management', name: 'User Management', category: 'admin', complexity: 'medium' },
    { id: 'api-access', name: 'API Access', category: 'integration', complexity: 'high' },
    { id: 'email-support', name: 'Email Support', category: 'support', complexity: 'low' },
    { id: 'priority-support', name: 'Priority Support', category: 'support', complexity: 'medium' },
    { id: 'custom-branding', name: 'Custom Branding', category: 'customization', complexity: 'medium' },
    { id: 'unlimited-projects', name: 'Unlimited Projects', category: 'limits', complexity: 'high' },
    { id: 'team-collaboration', name: 'Team Collaboration', category: 'collaboration', complexity: 'medium' },
    { id: 'data-export', name: 'Data Export', category: 'data', complexity: 'low' }
  ]

  const handleFeatureToggle = (featureId, tier) => {
    setFreemiumConfig(prev => {
      const otherTier = tier === 'free' ? 'paid' : 'free'
      return {
        ...prev,
        [tier + 'Features']: prev[tier + 'Features'].includes(featureId)
          ? prev[tier + 'Features'].filter(id => id !== featureId)
          : [...prev[tier + 'Features'], featureId],
        [otherTier + 'Features']: prev[otherTier + 'Features'].filter(id => id !== featureId)
      }
    })
  }

  const optimizeFreemium = () => {
    // Simulate freemium optimization analysis
    const mockOptimization = {
      conversionRate: 0.12,
      timeToConversion: 14,
      churnRisk: 0.25,
      recommendations: [
        'Move "Advanced Reports" to paid tier - high value feature',
        'Keep "Basic Analytics" free to demonstrate value',
        'Add usage limits to free tier (e.g., 3 projects max)',
        'Implement in-app upgrade prompts at natural friction points'
      ],
      conversionTriggers: [
        { trigger: 'Project limit reached', impact: 'High', timing: 'Week 2' },
        { trigger: 'Advanced feature needed', impact: 'Medium', timing: 'Week 3' },
        { trigger: 'Team collaboration required', impact: 'High', timing: 'Month 1' }
      ],
      projectedMetrics: {
        signups: 1000,
        conversions: 120,
        revenue: 3600,
        ltv: 180
      }
    }
    setOptimization(mockOptimization)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Freemium Strategy Optimizer
        </h1>
        <p className="text-lg text-text-secondary leading-7">
          Optimize your feature gating and conversion paths to maximize user acquisition 
          while driving upgrades to paid plans.
        </p>
      </div>

      {/* Feature Configuration */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Feature Tier Configuration
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Unlock className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Free Tier Features</h3>
            </div>
            <div className="space-y-3">
              {allFeatures.map((feature) => (
                <label
                  key={feature.id}
                  className={`cursor-pointer p-3 rounded-md border transition-colors flex items-center justify-between ${
                    freemiumConfig.freeFeatures.includes(feature.id)
                      ? 'border-green-400 bg-green-400 bg-opacity-10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div>
                    <span className="text-white text-sm font-medium">{feature.name}</span>
                    <div className="text-xs text-text-secondary mt-1">
                      {feature.category} • {feature.complexity} complexity
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={freemiumConfig.freeFeatures.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id, 'free')}
                    className="w-4 h-4 text-green-400 rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Paid Tier */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">Paid Tier Features</h3>
            </div>
            <div className="space-y-3">
              {allFeatures.map((feature) => (
                <label
                  key={feature.id}
                  className={`cursor-pointer p-3 rounded-md border transition-colors flex items-center justify-between ${
                    freemiumConfig.paidFeatures.includes(feature.id)
                      ? 'border-accent bg-accent bg-opacity-10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div>
                    <span className="text-white text-sm font-medium">{feature.name}</span>
                    <div className="text-xs text-text-secondary mt-1">
                      {feature.category} • {feature.complexity} complexity
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={freemiumConfig.paidFeatures.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id, 'paid')}
                    className="w-4 h-4 text-accent rounded"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={optimizeFreemium}
            className="button-primary flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Optimize Freemium Strategy
          </button>
        </div>
      </div>

      {/* Optimization Results */}
      {optimization && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-sm text-text-secondary">Conversion Rate</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(optimization.conversionRate * 100).toFixed(1)}%
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-text-secondary">Time to Convert</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {optimization.timeToConversion} days
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-text-secondary">Monthly Revenue</span>
              </div>
              <div className="text-2xl font-bold text-white">
                ${optimization.projectedMetrics.revenue.toLocaleString()}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-text-secondary">Customer LTV</span>
              </div>
              <div className="text-2xl font-bold text-white">
                ${optimization.projectedMetrics.ltv}
              </div>
            </div>
          </div>

          {/* Conversion Triggers */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Key Conversion Triggers
            </h3>
            <div className="space-y-4">
              {optimization.conversionTriggers.map((trigger, index) => (
                <div key={index} className="bg-bg p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{trigger.trigger}</h4>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        trigger.impact === 'High' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                        trigger.impact === 'Medium' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                        'bg-green-500 bg-opacity-20 text-green-400'
                      }`}>
                        {trigger.impact} Impact
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-600 text-gray-300">
                        {trigger.timing}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Optimization Recommendations
            </h3>
            <ul className="space-y-3">
              {optimization.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-accent mt-1">→</span>
                  <span className="text-text-secondary">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}