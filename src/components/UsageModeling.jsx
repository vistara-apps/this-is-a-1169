import React, { useState } from 'react'
import { BarChart3, Calculator, TrendingUp } from 'lucide-react'

export function UsageModeling() {
  const [usageConfig, setUsageConfig] = useState({
    metricType: '',
    baseUnit: '',
    tierStructure: 'linear',
    pricingModel: 'per-unit'
  })

  const [projections, setProjections] = useState(null)

  const handleConfigChange = (key, value) => {
    setUsageConfig(prev => ({ ...prev, [key]: value }))
  }

  const calculateProjections = () => {
    // Simulate usage-based pricing calculations
    const mockProjections = {
      tiers: [
        { name: 'Light Usage', min: 0, max: 1000, price: 0.01, users: 60, revenue: 300 },
        { name: 'Medium Usage', min: 1001, max: 10000, price: 0.008, users: 30, revenue: 2400 },
        { name: 'Heavy Usage', min: 10001, max: 100000, price: 0.005, users: 10, revenue: 4500 }
      ],
      totalRevenue: 7200,
      avgRevenuePerUser: 72,
      utilizationRate: 0.65
    }
    setProjections(mockProjections)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Usage-Based Monetization
        </h1>
        <p className="text-lg text-text-secondary leading-7">
          Model consumption-based pricing for APIs, data processing, and feature usage 
          to create fair and scalable revenue streams.
        </p>
      </div>

      {/* Configuration */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Usage Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Usage Metric Type
            </label>
            <select
              value={usageConfig.metricType}
              onChange={(e) => handleConfigChange('metricType', e.target.value)}
              className="input-field w-full"
            >
              <option value="">Select metric type</option>
              <option value="api-calls">API Calls</option>
              <option value="data-processed">Data Processed (GB)</option>
              <option value="active-users">Monthly Active Users</option>
              <option value="storage">Storage Used (GB)</option>
              <option value="transactions">Transactions</option>
              <option value="custom">Custom Metric</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Pricing Model
            </label>
            <select
              value={usageConfig.pricingModel}
              onChange={(e) => handleConfigChange('pricingModel', e.target.value)}
              className="input-field w-full"
            >
              <option value="per-unit">Per Unit</option>
              <option value="tiered">Tiered Pricing</option>
              <option value="volume-discount">Volume Discount</option>
              <option value="pay-as-you-go">Pay-as-you-go</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Base Price per Unit ($)
            </label>
            <input
              type="number"
              step="0.001"
              className="input-field w-full"
              placeholder="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tier Structure
            </label>
            <select
              value={usageConfig.tierStructure}
              onChange={(e) => handleConfigChange('tierStructure', e.target.value)}
              className="input-field w-full"
            >
              <option value="linear">Linear</option>
              <option value="exponential">Exponential</option>
              <option value="logarithmic">Logarithmic</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={calculateProjections}
            className="button-primary flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Calculate Usage Projections
          </button>
        </div>
      </div>

      {/* Projections */}
      {projections && (
        <div className="space-y-6">
          {/* Usage Tiers */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Usage Tier Analysis
            </h3>
            <div className="space-y-4">
              {projections.tiers.map((tier, index) => (
                <div key={index} className="bg-bg p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{tier.name}</h4>
                    <span className="text-sm text-accent font-medium">
                      ${tier.price.toFixed(3)} per unit
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Range:</span>
                      <div className="text-white font-medium">
                        {tier.min.toLocaleString()} - {tier.max.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Users:</span>
                      <div className="text-white font-medium">{tier.users}</div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Revenue:</span>
                      <div className="text-white font-medium">${tier.revenue}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span className="text-sm text-text-secondary">Total Revenue</span>
              </div>
              <div className="text-2xl font-bold text-white">
                ${projections.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-text-secondary mt-1">per month</div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-sm text-text-secondary">Avg Revenue/User</span>
              </div>
              <div className="text-2xl font-bold text-white">
                ${projections.avgRevenuePerUser}
              </div>
              <div className="text-sm text-text-secondary mt-1">monthly ARPU</div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="w-5 h-5 text-green-400" />
                <span className="text-sm text-text-secondary">Utilization Rate</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(projections.utilizationRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-text-secondary mt-1">efficiency</div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Optimization Recommendations
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span className="text-text-secondary">
                  Consider offering volume discounts for heavy users to encourage increased usage
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span className="text-text-secondary">
                  Implement usage alerts to help users optimize their consumption
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span className="text-text-secondary">
                  Add a free tier with 1,000 units to attract new users
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}