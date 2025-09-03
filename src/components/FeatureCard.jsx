import React from 'react'
import { ArrowRight } from 'lucide-react'

export function FeatureCard({ title, description, highlighted = false }) {
  return (
    <div className={`card relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
      highlighted ? 'ring-2 ring-accent' : ''
    }`}>
      {highlighted && (
        <div className="absolute top-0 right-0 bg-accent text-bg px-2 py-1 text-xs font-medium rounded-bl-md">
          Featured
        </div>
      )}
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-text-secondary leading-7">{description}</p>
        
        <button className="flex items-center gap-2 text-accent hover:text-accent-400 transition-colors">
          <span className="text-sm font-medium">Learn more</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}