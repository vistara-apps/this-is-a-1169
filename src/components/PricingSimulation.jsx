import React, { useState } from 'react'
import { Play, TrendingUp, DollarSign, Users } from 'lucide-react'
import { ConfigForm } from './ConfigForm'
import { SimulationChart } from './SimulationChart'
import { AIResponseDisplay } from './AIResponseDisplay'
import { useApp } from '../context/AppContext'
import { simulatePricing } from '../services/ai'

export function PricingSimulation() {
  const { state, dispatch } = useApp()
  const [simulationResults, setSimulationResults] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleRunSimulation = async (config) => {
    if (state.user.aiCredits <= 0) {
      dispatch({ type: 'SET_ERROR', payload: 'No AI credits remaining' })
      return
    }

    setIsSimulating(true)
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const results = await simulatePricing(config)
      setSimulationResults(results)
      
      // Use AI credit
      dispatch({ type: 'USE_AI_CREDIT' })
      
      // Save simulation
      const simulation = {
        resultId: `sim-${Date.now()}`,
        configId: config.configId || `config-${Date.now()}`,
        simulatedRevenue: results.scenarios[0]?.monthlyRevenue || 0,
        pricingStrategy: config.pricingStrategy,
        usageProjection: results.scenarios[0]?.customers || 0,
        timestamp: new Date().toISOString(),
        results
      }
      
      dispatch({ type: 'ADD_SIMULATION', payload: simulation })
      dispatch({ type: 'SET_ERROR', payload: null })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      setIsSimulating(false)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Dynamic Pricing Engine
        </h1>
        <p className="text-lg text-text-secondary leading-7">
          Simulate pricing strategies based on demand, user segments, and market conditions 
          to optimize your revenue potential.
        </p>
      </div>

      {/* Configuration Form */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Pricing Configuration
        </h2>
        <ConfigForm variant="pricing" onSubmit={handleRunSimulation} />
      </div>

      {/* Simulation Results */}
      {simulationResults && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {simulationResults.scenarios.map((scenario, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {scenario.name} Scenario
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      <span className="text-sm text-text-secondary">Monthly Revenue</span>
                    </div>
                    <span className="font-semibold text-white">
                      ${scenario.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm text-text-secondary">Customers</span>
                    </div>
                    <span className="font-semibold text-white">
                      {scenario.customers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-text-secondary">ARPU</span>
                    </div>
                    <span className="font-semibold text-white">
                      ${scenario.avgRevenuePerUser}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Revenue Projection
            </h3>
            <SimulationChart data={simulationResults.scenarios} variant="revenue" />
          </div>

          {/* AI Insights */}
          <AIResponseDisplay
            title="AI Insights & Recommendations"
            insights={simulationResults.insights}
            recommendations={simulationResults.recommendations}
            variant="success"
          />
        </div>
      )}

      {/* Loading State */}
      {isSimulating && (
        <AIResponseDisplay
          title="Running Simulation..."
          variant="loading"
        />
      )}

      {/* Error State */}
      {state.error && (
        <AIResponseDisplay
          title="Simulation Error"
          error={state.error}
          variant="error"
        />
      )}
    </div>
  )
}