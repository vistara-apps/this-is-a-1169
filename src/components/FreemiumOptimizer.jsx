import React, { useState } from 'react'
import { Zap, Users, TrendingUp, Lock, Unlock, DollarSign, BarChart, Percent } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useApp } from '../context/AppContext'
import { optimizeFreemiumStrategy } from '../services/ai'
import { AIResponseDisplay } from './AIResponseDisplay'

export function FreemiumOptimizer() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { state, dispatch } = useApp()
  const [freemiumConfig, setFreemiumConfig] = useState({
    freeFeatures: [],
    paidFeatures: [],
    conversionGoal: 'trial',
    productName: '',
    targetAudience: '',
    industry: '',
    basePrice: '',
    competitiveAnalysis: ''
  })
  
  const [optimization, setOptimization] = useState(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFreemiumConfig(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleOptimizeFreemium = async () => {
    if (state.user.aiCredits <= 0) {
      dispatch({ type: 'SET_ERROR', payload: 'No AI credits remaining' })
      return
    }

    if (freemiumConfig.freeFeatures.length === 0 || freemiumConfig.paidFeatures.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Please select at least one feature for each tier' })
      return
    }

    setIsOptimizing(true)
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Prepare the configuration object with feature details
      const freeFeatureDetails = freemiumConfig.freeFeatures.map(id => 
        allFeatures.find(feature => feature.id === id)
      )
      
      const paidFeatureDetails = freemiumConfig.paidFeatures.map(id => 
        allFeatures.find(feature => feature.id === id)
      )
      
      const config = {
        configId: `config-${Date.now()}`,
        variant: 'freemium',
        productName: freemiumConfig.productName,
        targetAudience: freemiumConfig.targetAudience,
        industry: freemiumConfig.industry,
        basePrice: freemiumConfig.basePrice,
        competitiveAnalysis: freemiumConfig.competitiveAnalysis,
        freeTier: {
          features: freeFeatureDetails
        },
        paidTier: {
          features: paidFeatureDetails
        },
        conversionGoal: freemiumConfig.conversionGoal,
        timestamp: new Date().toISOString()
      }

      // Save the configuration
      dispatch({ 
        type: 'ADD_BUSINESS_MODEL', 
        payload: {
          ...config,
          modelType: 'freemium',
          productDetails: freemiumConfig.productName,
          targetAudience: freemiumConfig.targetAudience,
          pricingParams: {
            basePrice: freemiumConfig.basePrice,
            freeFeatures: freemiumConfig.freeFeatures.length,
            paidFeatures: freemiumConfig.paidFeatures.length
          }
        }
      })

      // Call the AI service
      const results = await optimizeFreemiumStrategy(config)
      setOptimization(results)
      
      // Use AI credit
      dispatch({ type: 'USE_AI_CREDIT' })
      
      // Save simulation
      const simulation = {
        resultId: `sim-${Date.now()}`,
        configId: config.configId,
        simulatedRevenue: results.conversionStrategy?.estimatedConversionRate * 1000 * parseFloat(freemiumConfig.basePrice) || 0,
        pricingStrategy: 'freemium',
        usageProjection: results.conversionStrategy?.estimatedConversionRate || 0,
        timestamp: new Date().toISOString(),
        results
      }
      
      dispatch({ type: 'ADD_SIMULATION', payload: simulation })
      dispatch({ type: 'SET_ERROR', payload: null })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      setIsOptimizing(false)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
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

      {/* Product Information */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Product Information
        </h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Product/Service Name
              </label>
              <input
                name="productName"
                value={freemiumConfig.productName}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., Project Management SaaS"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Target Audience
              </label>
              <input
                name="targetAudience"
                value={freemiumConfig.targetAudience}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., Small business owners, freelancers"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Industry
              </label>
              <select
                name="industry"
                value={freemiumConfig.industry}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="">Select industry</option>
                <option value="saas">SaaS/Software</option>
                <option value="ecommerce">E-commerce</option>
                <option value="fintech">Fintech</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="media">Media/Entertainment</option>
                <option value="gaming">Gaming</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Paid Tier Base Price ($)
              </label>
              <input
                type="number"
                name="basePrice"
                value={freemiumConfig.basePrice}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., 29"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Conversion Goal
            </label>
            <select
              name="conversionGoal"
              value={freemiumConfig.conversionGoal}
              onChange={handleInputChange}
              className="input-field w-full"
            >
              <option value="trial">Free Trial to Paid</option>
              <option value="freemium">Freemium to Paid</option>
              <option value="upsell">Basic Tier to Premium</option>
              <option value="enterprise">Self-service to Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Competitive Analysis
            </label>
            <textarea
              name="competitiveAnalysis"
              value={freemiumConfig.competitiveAnalysis}
              onChange={handleInputChange}
              className="input-field w-full h-20"
              placeholder="Brief description of competitor offerings and their freemium strategies..."
            />
          </div>
        </div>
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
            onClick={handleOptimizeFreemium}
            disabled={isOptimizing || state.user.aiCredits <= 0}
            className="button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            {isOptimizing ? 'Optimizing...' : 'Optimize Freemium Strategy'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isOptimizing && (
        <AIResponseDisplay
          title="Optimizing Freemium Strategy..."
          variant="loading"
        />
      )}

      {/* Optimization Results */}
      {optimization && !isOptimizing && (
        <div className="space-y-6">
          {/* Free Tier Analysis */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Free Tier Analysis
            </h3>
            <div className="space-y-4">
              <h4 className="font-medium text-white">Recommended Features</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {optimization.freeTier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Unlock className="w-4 h-4 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <h4 className="font-medium text-white mt-4">Limitations</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {optimization.freeTier.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Lock className="w-4 h-4 text-yellow-400" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Paid Tiers */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Recommended Paid Tier Structure
            </h3>
            <div className="space-y-6">
              {optimization.paidTiers.map((tier, index) => (
                <div key={index} className="bg-bg p-4 rounded-md">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-white">{tier.name}</h4>
                    <span className="text-accent font-medium">${tier.price}</span>
                  </div>
                  <div className="text-sm text-text-secondary mb-3">
                    <strong>Target Users:</strong> {tier.targetUsers}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white mb-2">Key Features:</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tier.keyFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                          <Zap className="w-3 h-3 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Strategy */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Conversion Strategy
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-bg p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-4 h-4 text-accent" />
                  <span className="text-sm text-text-secondary">Est. Conversion Rate</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {(optimization.conversionStrategy.estimatedConversionRate * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-bg p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-text-secondary">Conversion Points</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {optimization.conversionStrategy.conversionPoints.length}
                </div>
              </div>
              
              <div className="bg-bg p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-text-secondary">Est. Monthly Revenue</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  ${Math.round(optimization.conversionStrategy.estimatedConversionRate * 1000 * parseFloat(freemiumConfig.basePrice || 0)).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Key Conversion Points</h4>
              <div className="space-y-3">
                {optimization.conversionStrategy.conversionPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span className="text-text-secondary">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-white mb-3">Recommended Messaging</h4>
              <div className="space-y-3">
                {optimization.conversionStrategy.messaging.map((message, index) => (
                  <div key={index} className="bg-surface p-3 rounded-md text-sm text-text-secondary">
                    "{message}"
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <AIResponseDisplay
            title="AI Insights & Recommendations"
            insights={optimization.insights}
            recommendations={optimization.recommendations}
            variant="success"
          />
        </div>
      )}

      {/* Error State */}
      {state.error && (
        <AIResponseDisplay
          title="Optimization Error"
          error={state.error}
          variant="error"
        />
      )}
    </div>
  )
}
