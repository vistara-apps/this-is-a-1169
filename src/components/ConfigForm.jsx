import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export function ConfigForm({ variant, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [selectedStrategy, setSelectedStrategy] = useState('')

  const handleFormSubmit = (data) => {
    const config = {
      configId: `config-${Date.now()}`,
      variant,
      ...data,
      pricingStrategy: selectedStrategy,
      timestamp: new Date().toISOString()
    }
    onSubmit(config)
  }

  if (variant === 'pricing') {
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Product/Service Name
            </label>
            <input
              {...register('productName', { required: 'Product name is required' })}
              className="input-field w-full"
              placeholder="e.g., Project Management SaaS"
            />
            {errors.productName && (
              <p className="text-red-400 text-sm mt-1">{errors.productName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Target Market
            </label>
            <select
              {...register('targetMarket', { required: 'Target market is required' })}
              className="input-field w-full"
            >
              <option value="">Select target market</option>
              <option value="individuals">Individual Consumers</option>
              <option value="small-business">Small Businesses (1-50 employees)</option>
              <option value="enterprise">Enterprise (500+ employees)</option>
              <option value="developers">Developers/Technical Users</option>
            </select>
            {errors.targetMarket && (
              <p className="text-red-400 text-sm mt-1">{errors.targetMarket.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Base Price ($)
            </label>
            <input
              type="number"
              {...register('basePrice', { required: 'Base price is required', min: 1 })}
              className="input-field w-full"
              placeholder="29"
            />
            {errors.basePrice && (
              <p className="text-red-400 text-sm mt-1">{errors.basePrice.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Market Demand
            </label>
            <select
              {...register('marketDemand', { required: 'Market demand is required' })}
              className="input-field w-full"
            >
              <option value="">Select demand level</option>
              <option value="low">Low Demand</option>
              <option value="medium">Medium Demand</option>
              <option value="high">High Demand</option>
              <option value="very-high">Very High Demand</option>
            </select>
            {errors.marketDemand && (
              <p className="text-red-400 text-sm mt-1">{errors.marketDemand.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Pricing Strategy
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'subscription', label: 'Subscription Model', desc: 'Monthly/yearly recurring payments' },
              { id: 'usage-based', label: 'Usage-Based', desc: 'Pay per use/consumption' },
              { id: 'freemium', label: 'Freemium', desc: 'Free tier with paid upgrades' },
              { id: 'one-time', label: 'One-Time Payment', desc: 'Single upfront payment' }
            ].map((strategy) => (
              <label
                key={strategy.id}
                className={`cursor-pointer p-4 rounded-md border-2 transition-colors ${
                  selectedStrategy === strategy.id
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  value={strategy.id}
                  checked={selectedStrategy === strategy.id}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  className="sr-only"
                />
                <div className="font-medium text-white">{strategy.label}</div>
                <div className="text-sm text-text-secondary mt-1">{strategy.desc}</div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Additional Notes
          </label>
          <textarea
            {...register('notes')}
            className="input-field w-full h-20"
            placeholder="Any specific requirements or constraints..."
          />
        </div>

        <button
          type="submit"
          className="button-primary w-full md:w-auto"
        >
          Run Pricing Simulation
        </button>
      </form>
    )
  }

  // Default form for other variants
  return (
    <div className="text-center py-8">
      <p className="text-text-secondary">
        Configuration form for {variant} coming soon...
      </p>
    </div>
  )
}