import React, { useState } from 'react'
import { Brain, Sparkles, Target, ArrowRight, CheckCircle, BarChart } from 'lucide-react'
import { AIResponseDisplay } from './AIResponseDisplay'
import { useApp } from '../context/AppContext'
import { generateBusinessModelSuggestions, generateBusinessModelRecommendations } from '../services/ai'

export function PreferenceRecommendations() {
  const { state, dispatch } = useApp()
  const [preferences, setPreferences] = useState({
    businessIdea: '',
    targetAudience: '',
    preferences: [],
    budget: '',
    timeline: '',
    industryType: '',
    growthStage: '',
    competitiveAdvantage: ''
  })
  const [suggestions, setSuggestions] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('suggestions') // 'suggestions' or 'recommendations'

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

  const industryOptions = [
    'SaaS/Software',
    'E-commerce',
    'Fintech',
    'Healthcare',
    'Education',
    'Media/Entertainment',
    'Gaming',
    'Web3/Blockchain',
    'AI/ML',
    'Hardware/IoT'
  ]

  const growthStageOptions = [
    'Pre-launch',
    'Early stage',
    'Growth stage',
    'Mature',
    'Pivoting'
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
    setActiveTab('suggestions')

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
  
  const handleGenerateRecommendations = async () => {
    if (state.user.aiCredits <= 0) {
      dispatch({ type: 'SET_ERROR', payload: 'No AI credits remaining' })
      return
    }

    if (preferences.preferences.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Please select at least one business model preference' })
      return
    }

    setIsGenerating(true)
    dispatch({ type: 'SET_LOADING', payload: true })
    setActiveTab('recommendations')

    try {
      // Create a more detailed preferences object for the AI
      const detailedPreferences = {
        modelPreferences: preferences.preferences,
        businessContext: {
          idea: preferences.businessIdea,
          targetAudience: preferences.targetAudience,
          industry: preferences.industryType,
          growthStage: preferences.growthStage,
          budget: preferences.budget,
          timeline: preferences.timeline,
          competitiveAdvantage: preferences.competitiveAdvantage
        }
      }
      
      const results = await generateBusinessModelRecommendations(detailedPreferences)
      setRecommendations(results)
      
      // Use AI credit
      dispatch({ type: 'USE_AI_CREDIT' })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Save to business models
      if (results.recommendedModels && results.recommendedModels.length > 0) {
        const topModel = results.recommendedModels[0]
        
        dispatch({
          type: 'ADD_BUSINESS_MODEL',
          payload: {
            configId: `config-${Date.now()}`,
            modelType: topModel.name,
            productDetails: preferences.businessIdea,
            targetAudience: preferences.targetAudience,
            pricingParams: topModel.implementation,
            preferences: preferences.preferences,
            timestamp: new Date().toISOString()
          }
        })
      }
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
                Industry Type
              </label>
              <select
                value={preferences.industryType}
                onChange={(e) => setPreferences(prev => ({ ...prev, industryType: e.target.value }))}
                className="input-field w-full"
              >
                <option value="">Select industry</option>
                {industryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Growth Stage
              </label>
              <select
                value={preferences.growthStage}
                onChange={(e) => setPreferences(prev => ({ ...prev, growthStage: e.target.value }))}
                className="input-field w-full"
              >
                <option value="">Select growth stage</option>
                {growthStageOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
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
            <label className="block text-sm font-medium text-white mb-2">
              Competitive Advantage
            </label>
            <input
              value={preferences.competitiveAdvantage}
              onChange={(e) => setPreferences(prev => ({ ...prev, competitiveAdvantage: e.target.value }))}
              className="input-field w-full"
              placeholder="What makes your business unique? (e.g., proprietary technology, team expertise)"
            />
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

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGenerateSuggestions}
              disabled={isGenerating || state.user.aiCredits <= 0 || !preferences.businessIdea || !preferences.targetAudience}
              className="button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Brain className="w-4 h-4" />
              Generate Business Models
            </button>
            
            <button
              onClick={handleGenerateRecommendations}
              disabled={isGenerating || state.user.aiCredits <= 0 || preferences.preferences.length === 0}
              className="button-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Target className="w-4 h-4" />
              Get Preference-Driven Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <AIResponseDisplay
          title="Analyzing Your Preferences..."
          variant="loading"
        />
      )}

      {/* Results Tabs */}
      {(suggestions || recommendations) && !isGenerating && (
        <div>
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'suggestions'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
            >
              Business Model Suggestions
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'recommendations'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
              disabled={!recommendations}
            >
              Preference-Driven Recommendations
            </button>
          </div>

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && suggestions && (
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

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && recommendations && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">
                Preference-Driven Recommendations
              </h2>
              
              {recommendations.recommendedModels.map((model, index) => (
                <div key={index} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {model.name}
                    </h3>
                    {index === 0 && (
                      <span className="bg-primary bg-opacity-20 text-primary px-2 py-1 rounded text-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Best Match
                      </span>
                    )}
                  </div>
                  
                  <p className="text-text-secondary mb-4 leading-7">
                    {model.description}
                  </p>
                  
                  <div className="bg-bg p-4 rounded-md mb-4">
                    <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-accent" />
                      Alignment with Your Preferences
                    </h4>
                    <p className="text-text-secondary text-sm">
                      {model.alignment}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-white mb-2">
                        Implementation Steps
                      </h4>
                      <p className="text-text-secondary text-sm">
                        {model.implementation}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white mb-2">
                        Key Metrics to Track
                      </h4>
                      <ul className="space-y-1">
                        {model.metrics.map((metric, i) => (
                          <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>{metric}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Real-World Examples
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {model.examples.map((example, i) => (
                        <span key={i} className="bg-surface px-2 py-1 rounded text-sm text-text-secondary">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="button-primary text-sm flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      Implement This Model
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Insights and Next Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Key Insights
                  </h3>
                  <ul className="space-y-3">
                    {recommendations.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span className="text-text-secondary">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="card">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Recommended Next Steps
                  </h3>
                  <ol className="space-y-3">
                    {recommendations.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-accent font-medium">{index + 1}.</span>
                        <span className="text-text-secondary">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
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
