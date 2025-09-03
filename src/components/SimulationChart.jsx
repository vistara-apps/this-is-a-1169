import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

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

  const formatPercent = (value) => {
    return `${value}%`
  }

  // For revenue and customer charts
  if (variant === 'revenue' || variant === 'customers') {
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

  // For usage-based charts (pie chart for customer distribution)
  if (variant === 'usage') {
    const COLORS = [
      'hsl(220 50% 40%)', // primary
      'hsl(180 60% 50%)', // accent
      'hsl(120 60% 50%)', // green
      'hsl(30 80% 50%)',  // orange
      'hsl(270 60% 50%)'  // purple
    ]

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220 15% 15%)',
                border: '1px solid hsl(220 15% 25%)',
                borderRadius: '6px',
                color: 'hsl(220 10% 90%)'
              }}
              formatter={(value, name) => [
                `${value}%`,
                name
              ]}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => <span style={{ color: 'hsl(220 10% 90%)', fontSize: '12px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // For freemium charts
  if (variant === 'freemium') {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 25%)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(220 10% 60%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(220 10% 60%)"
              fontSize={12}
              tickFormatter={formatPercent}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(220 15% 15%)',
                border: '1px solid hsl(220 15% 25%)',
                borderRadius: '6px',
                color: 'hsl(220 10% 90%)'
              }}
              formatter={(value, name) => [
                `${value}%`,
                name
              ]}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(180 60% 50%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Default fallback
  return (
    <div className="h-64 flex items-center justify-center text-text-secondary">
      Unsupported chart variant
    </div>
  )
}
