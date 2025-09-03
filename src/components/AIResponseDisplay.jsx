import React from 'react'
import { CheckCircle, AlertCircle, Loader2, Lightbulb, Target } from 'lucide-react'

export function AIResponseDisplay({ title, insights = [], recommendations = [], error, variant = 'success' }) {
  const getIcon = () => {
    switch (variant) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-accent" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'success':
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />
    }
  }

  const getBorderColor = () => {
    switch (variant) {
      case 'loading':
        return 'border-accent'
      case 'error':
        return 'border-red-400'
      case 'success':
      default:
        return 'border-green-400'
    }
  }

  return (
    <div className={`card border-l-4 ${getBorderColor()}`}>
      <div className="flex items-center gap-3 mb-4">
        {getIcon()}
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>

      {variant === 'loading' && (
        <div className="space-y-2">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      )}

      {variant === 'error' && error && (
        <div className="text-red-400">
          <p>{error}</p>
        </div>
      )}

      {variant === 'success' && (
        <div className="space-y-6">
          {insights.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-accent" />
                <h4 className="font-medium text-white">Key Insights</h4>
              </div>
              <ul className="space-y-2">
                {insights.map((insight, index) => (
                  <li key={index} className="text-text-secondary flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-primary" />
                <h4 className="font-medium text-white">Recommendations</h4>
              </div>
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="text-text-secondary flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}