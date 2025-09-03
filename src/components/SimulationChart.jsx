import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function SimulationChart({ data, variant }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-secondary">
        No data to display
      </div>
    )
  }

  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`
  }

  const chartData = data.map(scenario => ({
    name: scenario.name,
    revenue: scenario.monthlyRevenue,
    customers: scenario.customers,
    arpu: scenario.avgRevenuePerUser
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 25%)" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(220 10% 60%)"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(220 10% 60%)"
            fontSize={12}
            tickFormatter={variant === 'revenue' ? formatCurrency : undefined}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(220 15% 15%)',
              border: '1px solid hsl(220 15% 25%)',
              borderRadius: '6px',
              color: 'hsl(220 10% 90%)'
            }}
            formatter={(value, name) => [
              variant === 'revenue' ? formatCurrency(value) : value,
              name === 'revenue' ? 'Monthly Revenue' : 
              name === 'customers' ? 'Customers' : 'ARPU'
            ]}
          />
          <Bar 
            dataKey={variant === 'revenue' ? 'revenue' : 'customers'} 
            fill="hsl(220 50% 40%)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}