import React, { useState } from 'react'
import { Brain, Sparkles, Target } from 'lucide-react'
import { AIResponseDisplay } from './AIResponseDisplay'
import { useApp } from '../context/AppContext'
import { generateBusinessModelSuggestions } from '../services/ai'

export function PreferenceRecommendations() {
  const { state, dispatch } = useApp()
  const [preferences, setPreferences] = useState({
    businessIdea: '',
    targetAudience: '',
    preferences: [],
    budget: '',
    timeline: ''
  })
  const [suggestions, setSuggestions] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const preferenceOptions = [
    'Subscription-based revenue',
    'One-time payments',
    'Freemium model',
    'Usage-based pricing',
    'Marketplace commission',
    'Token-based economy',
    'Free trials',
    'Enterprise sales',
    'Self-service signup',
    'Community-driven growth'
  ]

  const handlePreferenceToggle = (preference) => {
    setPreferences(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }))
  }

  const handleGenerateSuggestions = async () => {
    if (state.user.aiCredits <= 0) {
      dispatch({ type: 'SET_ERROR', payload: 'No AI credits remaining' })
      return
    }

    if (!preferences.businessIdea || !preferences.targetAudience) {
      dispatch({ type: 'SET_ERROR', payload: 'Please fill in business idea and target audience' })
      return
    }

    setIsGenerating(true)
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const results = await generateBusinessModelSuggestions(preferences)
      setSuggestions(results)
      
      // Use AI credit
      dispatch({ type: 'USE_AI_CREDIT' })
      dispatch({ type: 'SET_ERROR', payload: null })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      setIsGenerating(false)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold text-white mb-4">
          AI Business Model Recommendations
        </h1>
        <p className="text-lg text-text-secondary leading-7">
          Get personalized business model suggestions based on your preferences, 
          target market, and business goals.
        </p>
      </div>

      {/* Input Form */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Tell us about your business
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Business Idea
            </label>
            <textarea
              value={preferences.businessIdea}
              onChange={(e) => setPreferences(prev => ({ ...prev, businessIdea: e.target.value }))}
              className="input-field w-full h-24"
              placeholder="Describe your business idea, product, or service..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Target Audience
            </label>
            <input
              value={preferences.targetAudience}
              onChange={(e) => setPreferences(prev => ({ ...prev, targetAudience: e.target.value }))}
              className="input-field w-full"
              placeholder="Who are your ideal customers? (e.g., small business owners, developers, freelancers)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Budget Range
              </label>
              <select
                value={preferences.budget}
                onChange={(e) => setPreferences(prev => ({ ...prev, budget: e.target.value }))}
                className="input-field w-full"
              >
                <option value="">Select budget range</option>
                <option value="under-10k">Under $10k</option>
                <option value="10k-50k">$10k - $50k</option>
                <option value="50k-100k">$50k - $100k</option>
                <option value="over-100k">Over $100k</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Timeline to Revenue
              </label>
              <select
                value={preferences.timeline}
                onChange={(e) => setPreferences(prev => ({ ...prev, timeline: e.target.value }))}
                className="input-field w-full"
              >
                <option value="">Select timeline</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-12-months">6-12 months</option>
                <option value="over-12-months">Over 12 months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Business Model Preferences
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {preferenceOptions.map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer p-3 rounded-md border transition-colors ${
                    preferences.preferences.includes(option)
                      ? 'border-accent bg-accent bg-opacity-10 text-accent'
                      : 'border-gray-600 text-text-secondary hover:border-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={preferences.preferences.includes(option)}
                    onChange={() => handlePreferenceToggle(option)}
                    className="sr-only"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateSuggestions}
            disabled={isGenerating || state.user.aiCredits <= 0}
            className="button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Brain className="w-4 h-4" />
            Generate AI Recommendations
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <AIResponseDisplay
          title="Analyzing Your Preferences..."
          variant="loading"
        />
      )}

      {/* Suggestions */}
      {suggestions && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">
            Recommended Business Models
          </h2>
          
          {suggestions.map((suggestion, index) => (
            <div key={index} className="card">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {suggestion.name}
                </h3>
                <span className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded text-sm">
                  {suggestion.revenueProjection}
                </span>
              </div>
              
              <p className="text-text-secondary mb-4 leading-7">
                {suggestion.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-400" />
                    Advantages
                  </h4>
                  <ul className="space-y-1">
                    {suggestion.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-green-400 mt-1">+</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Considerations
                  </h4>
                  <ul className="space-y-1">
                    {suggestion.cons.map((con, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">!</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Pricing Strategy:</span>
                    <span className="text-white ml-2">{suggestion.pricingStrategy}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Target Market:</span>
                    <span className="text-white ml-2">{suggestion.targetMarket}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button className="button-secondary text-sm">
                  Use This Model
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {state.error && (
        <AIResponseDisplay
          title="Generation Error"
          error={state.error}
          variant="error"
        />
      )}
    </div>
  )
}