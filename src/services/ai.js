import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export async function generateBusinessModelSuggestions(input) {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are a business model expert helping solo founders. Generate 3-5 specific, actionable business model suggestions based on the user's input. 
          
          Format your response as a JSON array with this structure:
          [
            {
              "name": "Model Name",
              "description": "Detailed description",
              "pricingStrategy": "Pricing approach",
              "targetMarket": "Primary audience",
              "revenueProjection": "Estimated monthly revenue range",
              "pros": ["advantage 1", "advantage 2"],
              "cons": ["limitation 1", "limitation 2"]
            }
          ]`
        },
        {
          role: "user",
          content: `Business idea: ${input.businessIdea}
          Target audience: ${input.targetAudience}
          Preferences: ${input.preferences.join(', ')}
          Budget: ${input.budget || 'Not specified'}
          Timeline: ${input.timeline || 'Not specified'}`
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })

    const content = response.choices[0].message.content
    // Try to parse JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback if JSON parsing fails
    return [{
      name: "Subscription SaaS",
      description: "Monthly recurring revenue model with tiered pricing",
      pricingStrategy: "Freemium with paid tiers",
      targetMarket: "Small to medium businesses",
      revenueProjection: "$1,000 - $10,000/month",
      pros: ["Predictable revenue", "Scalable growth"],
      cons: ["High customer acquisition cost", "Churn risk"]
    }]
  } catch (error) {
    console.error('AI API Error:', error)
    throw new Error('Failed to generate suggestions. Please check your API key.')
  }
}

export async function simulatePricing(config) {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are a pricing strategy expert. Analyze the given pricing configuration and provide simulation results.
          
          Return a JSON object with this structure:
          {
            "scenarios": [
              {
                "name": "Conservative",
                "monthlyRevenue": number,
                "customers": number,
                "avgRevenuePerUser": number,
                "conversionRate": number
              }
            ],
            "recommendations": ["rec1", "rec2"],
            "insights": ["insight1", "insight2"]
          }`
        },
        {
          role: "user",
          content: `Pricing configuration: ${JSON.stringify(config)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    const content = response.choices[0].message.content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback simulation
    return {
      scenarios: [
        {
          name: "Conservative",
          monthlyRevenue: 5000,
          customers: 100,
          avgRevenuePerUser: 50,
          conversionRate: 0.05
        },
        {
          name: "Optimistic",
          monthlyRevenue: 15000,
          customers: 250,
          avgRevenuePerUser: 60,
          conversionRate: 0.08
        }
      ],
      recommendations: [
        "Consider offering a 14-day free trial",
        "Test value-based pricing for enterprise customers"
      ],
      insights: [
        "Price elasticity suggests room for 20% increase",
        "Customer acquisition cost should stay below $100"
      ]
    }
  } catch (error) {
    console.error('Pricing simulation error:', error)
    throw new Error('Failed to run pricing simulation')
  }
}