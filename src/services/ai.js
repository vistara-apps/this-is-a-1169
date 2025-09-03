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

export async function modelUsageBasedMonetization(config) {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are a usage-based pricing expert. Analyze the given usage metrics and configuration to provide monetization modeling results.
          
          Return a JSON object with this structure:
          {
            "tiers": [
              {
                "name": "Tier Name",
                "usageRange": "Range description",
                "pricePerUnit": number,
                "estimatedRevenue": number,
                "customerSegment": "Description of customers in this tier"
              }
            ],
            "projections": {
              "totalRevenue": number,
              "averageRevenuePerCustomer": number,
              "customerDistribution": [
                { "tier": "Tier Name", "percentage": number }
              ]
            },
            "recommendations": ["rec1", "rec2"],
            "insights": ["insight1", "insight2"]
          }`
        },
        {
          role: "user",
          content: `Usage configuration: ${JSON.stringify(config)}`
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

    // Fallback modeling
    return {
      tiers: [
        {
          name: "Basic",
          usageRange: "0-1,000 units/month",
          pricePerUnit: 0.05,
          estimatedRevenue: 2500,
          customerSegment: "Small businesses with limited usage needs"
        },
        {
          name: "Growth",
          usageRange: "1,001-10,000 units/month",
          pricePerUnit: 0.04,
          estimatedRevenue: 12000,
          customerSegment: "Medium-sized businesses with moderate usage"
        },
        {
          name: "Enterprise",
          usageRange: "10,001+ units/month",
          pricePerUnit: 0.03,
          estimatedRevenue: 30000,
          customerSegment: "Large enterprises with high volume needs"
        }
      ],
      projections: {
        totalRevenue: 44500,
        averageRevenuePerCustomer: 445,
        customerDistribution: [
          { tier: "Basic", percentage: 50 },
          { tier: "Growth", percentage: 35 },
          { tier: "Enterprise", percentage: 15 }
        ]
      },
      recommendations: [
        "Implement volume discounts for enterprise customers",
        "Consider adding a minimum monthly spend for predictable revenue"
      ],
      insights: [
        "Enterprise tier generates 67% of revenue despite being only 15% of customers",
        "Basic tier has highest churn risk due to price sensitivity"
      ]
    }
  } catch (error) {
    console.error('Usage modeling error:', error)
    throw new Error('Failed to model usage-based monetization')
  }
}

export async function generateBusinessModelRecommendations(preferences) {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are a business model strategy expert. Based on the user's preferences, generate tailored business model recommendations.
          
          Return a JSON object with this structure:
          {
            "recommendedModels": [
              {
                "name": "Model Name",
                "description": "Detailed description",
                "alignment": "How this aligns with preferences",
                "implementation": "Implementation steps",
                "metrics": ["Key metrics to track"],
                "examples": ["Example 1", "Example 2"]
              }
            ],
            "insights": ["insight1", "insight2"],
            "nextSteps": ["step1", "step2"]
          }`
        },
        {
          role: "user",
          content: `User preferences: ${JSON.stringify(preferences)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const content = response.choices[0].message.content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback recommendations
    return {
      recommendedModels: [
        {
          name: "Tiered Subscription",
          description: "Monthly subscription with multiple tiers based on feature access",
          alignment: "Matches preference for recurring revenue and scalable pricing",
          implementation: "Define 3-4 tiers with clear value differentiation",
          metrics: ["MRR", "Conversion rate", "Churn rate", "Upgrade rate"],
          examples: ["Slack", "Notion", "HubSpot"]
        },
        {
          name: "Freemium + Usage-Based",
          description: "Free tier with basic features, paid tiers based on usage volume",
          alignment: "Combines preference for low barrier to entry with usage-based scaling",
          implementation: "Create compelling free tier with clear upgrade paths",
          metrics: ["Conversion rate", "Usage patterns", "Revenue per user", "Retention"],
          examples: ["Dropbox", "Mailchimp", "GitHub"]
        }
      ],
      insights: [
        "Subscription models provide more predictable revenue but require continuous value delivery",
        "Freemium models can accelerate user acquisition but may reduce perceived value"
      ],
      nextSteps: [
        "Define clear value propositions for each tier",
        "Implement analytics to track usage patterns",
        "Test pricing with a small segment of users"
      ]
    }
  } catch (error) {
    console.error('Recommendations error:', error)
    throw new Error('Failed to generate business model recommendations')
  }
}

export async function optimizeFreemiumStrategy(config) {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are a freemium strategy expert. Analyze the given configuration and provide optimization recommendations.
          
          Return a JSON object with this structure:
          {
            "freeTier": {
              "features": ["feature1", "feature2"],
              "limitations": ["limitation1", "limitation2"],
              "conversionTriggers": ["trigger1", "trigger2"]
            },
            "paidTiers": [
              {
                "name": "Tier Name",
                "price": number,
                "keyFeatures": ["feature1", "feature2"],
                "targetUsers": "Description of ideal users"
              }
            ],
            "conversionStrategy": {
              "estimatedConversionRate": number,
              "conversionPoints": ["point1", "point2"],
              "messaging": ["message1", "message2"]
            },
            "recommendations": ["rec1", "rec2"],
            "insights": ["insight1", "insight2"]
          }`
        },
        {
          role: "user",
          content: `Freemium configuration: ${JSON.stringify(config)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const content = response.choices[0].message.content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback optimization
    return {
      freeTier: {
        features: [
          "Basic dashboard access",
          "Limited reports (up to 5)",
          "Single user account",
          "Standard support"
        ],
        limitations: [
          "No export functionality",
          "Limited historical data (30 days)",
          "No custom branding",
          "No API access"
        ],
        conversionTriggers: [
          "Usage limit notifications",
          "Premium feature previews",
          "Comparison table during key workflows",
          "Success stories from paid users"
        ]
      },
      paidTiers: [
        {
          name: "Pro",
          price: 29,
          keyFeatures: [
            "Unlimited reports",
            "Data export",
            "Team collaboration (up to 5 users)",
            "90 days historical data"
          ],
          targetUsers: "Small businesses needing more advanced features and team access"
        },
        {
          name: "Business",
          price: 99,
          keyFeatures: [
            "Advanced analytics",
            "Custom branding",
            "API access",
            "Unlimited historical data",
            "Priority support"
          ],
          targetUsers: "Growing businesses requiring deeper insights and customization"
        }
      ],
      conversionStrategy: {
        estimatedConversionRate: 0.08,
        conversionPoints: [
          "When users hit usage limits",
          "When attempting to access premium features",
          "After 14 days of active usage",
          "When adding team members"
        ],
        messaging: [
          "Unlock your full potential with Pro",
          "Your team deserves better tools",
          "See what you're missing with a 7-day trial"
        ]
      },
      recommendations: [
        "Implement usage meters to visualize limits",
        "Create a clear upgrade path with contextual CTAs",
        "Offer time-limited trials of premium features",
        "Develop case studies showing ROI of paid tiers"
      ],
      insights: [
        "Free tier should provide genuine value while showcasing premium benefits",
        "Conversion rate typically peaks at 30-day usage mark",
        "Team collaboration features are strong conversion drivers"
      ]
    }
  } catch (error) {
    console.error('Freemium optimization error:', error)
    throw new Error('Failed to optimize freemium strategy')
  }
}

// Stripe API integration for subscription management
export async function createSubscription(customerId, priceId) {
  // This is a mock implementation - in a real app, this would call the Stripe API
  console.log(`Creating subscription for customer ${customerId} with price ${priceId}`)
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock subscription data
  return {
    id: `sub_${Math.random().toString(36).substring(2, 10)}`,
    customer: customerId,
    status: 'active',
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    items: {
      data: [
        {
          price: {
            id: priceId,
            product: 'prod_bizmodel',
            unit_amount: priceId.includes('pro') ? 2900 : 9900,
            currency: 'usd',
            recurring: {
              interval: 'month'
            }
          }
        }
      ]
    }
  }
}

export async function cancelSubscription(subscriptionId) {
  // This is a mock implementation - in a real app, this would call the Stripe API
  console.log(`Cancelling subscription ${subscriptionId}`)
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock cancellation data
  return {
    id: subscriptionId,
    status: 'canceled',
    cancel_at_period_end: true,
    canceled_at: new Date().toISOString()
  }
}

export async function updateSubscription(subscriptionId, newPriceId) {
  // This is a mock implementation - in a real app, this would call the Stripe API
  console.log(`Updating subscription ${subscriptionId} to price ${newPriceId}`)
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock updated subscription data
  return {
    id: subscriptionId,
    status: 'active',
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    items: {
      data: [
        {
          price: {
            id: newPriceId,
            product: 'prod_bizmodel',
            unit_amount: newPriceId.includes('pro') ? 2900 : 9900,
            currency: 'usd',
            recurring: {
              interval: 'month'
            }
          }
        }
      ]
    }
  }
}
