import React, { useState } from 'react'
import { SidebarNav } from './components/SidebarNav'
import { Dashboard } from './components/Dashboard'
import { PricingSimulation } from './components/PricingSimulation'
import { UsageModeling } from './components/UsageModeling'
import { PreferenceRecommendations } from './components/PreferenceRecommendations'
import { FreemiumOptimizer } from './components/FreemiumOptimizer'
import { AppProvider } from './context/AppContext'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'pricing':
        return <PricingSimulation />
      case 'usage':
        return <UsageModeling />
      case 'recommendations':
        return <PreferenceRecommendations />
      case 'freemium':
        return <FreemiumOptimizer />
      default:
        return <Dashboard />
    }
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-bg text-text">
        <div className="flex">
          <SidebarNav 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          <main className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto px-5 py-8">
              {renderActiveSection()}
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  )
}

export default App