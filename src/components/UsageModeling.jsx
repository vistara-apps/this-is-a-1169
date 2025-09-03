import React, { useState } from 'react'
import { BarChart3, Calculator, TrendingUp, Users, DollarSign, Percent } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useApp } from '../context/AppContext'
import { modelUsageBasedMonetization } from '../services/ai'
import { SimulationChart } from './SimulationChart'
import { AIResponseDisplay } from './AIResponseDisplay'

export function UsageModeling() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { state, dispatch } = useApp()
  const [modelingResults, setModelingResults] = useState(null)
  const [isModeling, setIsModeling] = useState(false)

  const handleRunModeling = async (data) => {
    if (state.user.aiCredits <= 0) {
      dispatch({ type: 'SET_ERROR', payload: 'No AI credits remaining' })
      return
    }

    setIsModeling(true)
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Prepare the configuration object
      const config = {
        configId: `config-${Date.now()}`,
        variant: 'usage',
        ...data,
        timestamp: new Date().toISOString()
      }

      // Save the configuration
      dispatch({ 
        type: 'ADD_BUSINESS_MODEL', 
        payload: {
          ...config,
          modelType: 'usage-based',
          productDetails: data.productName,
          targetAudience: data.targetMarket
        }
      })

      // Call the AI service
      const results = await modelUsageBasedMonetization(config)
      setModelingResults(results)
      
      // Use AI credit
      dispatch({ type: 'USE_AI_CREDIT' })
      
      // Save simulation
      const simulation = {
        resultId: `sim-${Date.now()}`,
        configId: config.configId,
        simulatedRevenue: results.projections.totalRevenue,
        pricingStrategy: 'usage-based',
        usageProjection: results.projections.averageRevenuePerCustomer,
        timestamp: new Date().toISOString(),
        results
      }
      
      dispatch({ type: 'ADD_SIMULATION', payload: simulation })
      dispatch({ type: 'SET_ERROR', payload: null })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      setIsModeling(false)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
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

      {/* Configuration Form */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Usage Configuration
        </h2>
        
        <form onSubmit={handleSubmit(handleRunModeling)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Product/Service Name
              </label>
              <input
                {...register('productName', { required: 'Product name is required' })}
                className="input-field w-full"
                placeholder="e.g., API Service"
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
                <option value="developers">Developers/Technical Users</option>
                <option value="small-business">Small Businesses (1-50 employees)</option>
                <option value="mid-market">Mid-Market (51-500 employees)</option>
                <option value="enterprise">Enterprise (500+ employees)</option>
              </select>
              {errors.targetMarket && (
                <p className="text-red-400 text-sm mt-1">{errors.targetMarket.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Usage Metric Type
              </label>
              <select
                {...register('metricType', { required: 'Metric type is required' })}
                className="input-field w-full"
              >
                <option value="">Select metric type</option>
                <option value="api-calls">API Calls</option>
                <option value="data-processed">Data Processed (GB)</option>
                <option value="active-users">Monthly Active Users</option>
                <option value="storage">Storage Used (GB)</option>
                <option value="transactions">Transactions</option>
                <option value="compute-time">Compute Time (hours)</option>
                <option value="custom">Custom Metric</option>
              </select>
              {errors.metricType && (
                <p className="text-red-400 text-sm mt-1">{errors.metricType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Pricing Model
              </label>
              <select
                {...register('pricingModel', { required: 'Pricing model is required' })}
                className="input-field w-full"
              >
                <option value="per-unit">Per Unit</option>
                <option value="tiered">Tiered Pricing</option>
                <option value="volume-discount">Volume Discount</option>
                <option value="pay-as-you-go">Pay-as-you-go</option>
                <option value="hybrid">Hybrid (Base + Usage)</option>
              </select>
              {errors.pricingModel && (
                <p className="text-red-400 text-sm mt-1">{errors.pricingModel.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Base Price per Unit ($)
              </label>
              <input
                type="number"
                step="0.001"
                {...register('basePrice', { 
                  required: 'Base price is required',
                  min: { value: 0.001, message: 'Price must be at least 0.001' }
                })}
                className="input-field w-full"
                placeholder="0.01"
              />
              {errors.basePrice && (
                <p className="text-red-400 text-sm mt-1">{errors.basePrice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Estimated Monthly Volume
              </label>
              <input
                type="number"
                {...register('estimatedVolume', { 
                  required: 'Estimated volume is required',
                  min: { value: 1, message: 'Volume must be at least 1' }
                })}
                className="input-field w-full"
                placeholder="10000"
              />
              {errors.estimatedVolume && (
                <p className="text-red-400 text-sm mt-1">{errors.estimatedVolume.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tier Structure
              </label>
              <select
                {...register('tierStructure')}
                className="input-field w-full"
              >
                <option value="linear">Linear</option>
                <option value="exponential">Exponential</option>
                <option value="logarithmic">Logarithmic</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Competitive Pressure
              </label>
              <select
                {...register('competitivePressure')}
                className="input-field w-full"
              >
                <option value="low">Low (Few Competitors)</option>
                <option value="medium">Medium</option>
                <option value="high">High (Many Competitors)</option>
              </select>
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
            disabled={isModeling}
            className="button-primary flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            {isModeling ? 'Modeling...' : 'Model Usage-Based Monetization'}
          </button>
        </form>
      </div>

      {/* Modeling Results */}
      {modelingResults && (
        <div className="space-y-6">
          {/* Usage Tiers */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Usage Tier Analysis
            </h3>
            <div className="space-y-4">
              {modelingResults.tiers.map((tier, index) => (
                <div key={index} className="bg-bg p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{tier.name}</h4>
                    <span className="text-sm text-accent font-medium">
                      ${tier.pricePerUnit} per unit
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Range:</span>
                      <div className="text-white font-medium">
                        {tier.usageRange}
                      </div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Est. Revenue:</span>
                      <div className="text-white font-medium">${tier.estimatedRevenue.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Target Segment:</span>
                      <div className="text-white font-medium">{tier.customerSegment}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Projections */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Revenue Projections
            </h3>
            <div className="mb-6">
              <SimulationChart 
                data={modelingResults.projections.customerDistribution.map(item => ({
                  name: item.tier,
                  value: item.percentage
                }))} 
                variant="usage" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-sm text-text-secondary">Total Revenue</div>
                  <div className="text-xl font-bold text-white">
                    ${modelingResults.projections.totalRevenue.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-text-secondary">Avg Revenue/Customer</div>
                  <div className="text-xl font-bold text-white">
                    ${modelingResults.projections.averageRevenuePerCustomer}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Percent className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm text-text-secondary">Customer Distribution</div>
                  <div className="text-xl font-bold text-white">
                    {modelingResults.projections.customerDistribution.length} tiers
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <AIResponseDisplay
            title="AI Insights & Recommendations"
            insights={modelingResults.insights}
            recommendations={modelingResults.recommendations}
            variant="success"
          />
        </div>
      )}

      {/* Loading State */}
      {isModeling && (
        <AIResponseDisplay
          title="Modeling Usage-Based Monetization..."
          variant="loading"
        />
      )}

      {/* Error State */}
      {state.error && (
        <AIResponseDisplay
          title="Modeling Error"
          error={state.error}
          variant="error"
        />
      )}
    </div>
  )
}
