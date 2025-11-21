import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown, Shield, Users, BarChart, Headphones } from 'lucide-react'

const UpgradePlan = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [currentPlan, setCurrentPlan] = useState('basic')

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Shield,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        'Up to 5 users',
        '10GB storage',
        'Basic analytics',
        'Email support',
        'Standard templates'
      ],
      color: 'gray',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      icon: Star,
      price: { monthly: 29, yearly: 290 },
      description: 'Best for growing teams',
      features: [
        'Up to 25 users',
        '100GB storage',
        'Advanced analytics',
        'Priority support',
        'Custom templates',
        'API access',
        'Advanced reporting'
      ],
      color: 'blue',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Crown,
      price: { monthly: 99, yearly: 990 },
      description: 'For large organizations',
      features: [
        'Unlimited users',
        '1TB storage',
        'Custom analytics',
        '24/7 phone support',
        'White-label solution',
        'Advanced API',
        'Custom integrations',
        'Dedicated manager'
      ],
      color: 'purple',
      popular: false
    }
  ]

  const getColorClasses = (color, variant = 'bg') => {
    const colors = {
      gray: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-600 dark:text-gray-400',
        button: 'btn-secondary',
        gradient: 'from-gray-500 to-gray-600'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        button: 'btn-primary',
        gradient: 'from-blue-500 to-blue-600'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400',
        button: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700',
        gradient: 'from-purple-500 to-purple-600'
      }
    }
    return colors[color]?.[variant] || colors.gray[variant]
  }

  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'Dashboard Access', basic: true, pro: true, enterprise: true },
        { name: 'User Management', basic: '5 users', pro: '25 users', enterprise: 'Unlimited' },
        { name: 'Storage', basic: '10GB', pro: '100GB', enterprise: '1TB' },
        { name: 'Projects', basic: '3', pro: 'Unlimited', enterprise: 'Unlimited' }
      ]
    },
    {
      category: 'Analytics & Reporting',
      items: [
        { name: 'Basic Reports', basic: true, pro: true, enterprise: true },
        { name: 'Advanced Analytics', basic: false, pro: true, enterprise: true },
        { name: 'Custom Reports', basic: false, pro: true, enterprise: true },
        { name: 'Real-time Data', basic: false, pro: false, enterprise: true }
      ]
    },
    {
      category: 'Support & Services',
      items: [
        { name: 'Email Support', basic: true, pro: true, enterprise: true },
        { name: 'Priority Support', basic: false, pro: true, enterprise: true },
        { name: '24/7 Phone Support', basic: false, pro: false, enterprise: true },
        { name: 'Dedicated Manager', basic: false, pro: false, enterprise: true }
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Upgrade to unlock more features and grow your business
        </p>
        
        <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Yearly
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded text-xs">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const Icon = plan.icon
          const isCurrentPlan = currentPlan === plan.id
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative card-floating p-8 ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${getColorClasses(plan.color, 'gradient')} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    ${plan.price[billingCycle]}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isCurrentPlan 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400'
                    : getColorClasses(plan.color, 'button')
                }`}
                disabled={isCurrentPlan}
              >
                {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </motion.div>
          )
        })}
      </div>

      <div className="card-floating p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Feature Comparison
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                  Features
                </th>
                <th className="text-center py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                  Basic
                </th>
                <th className="text-center py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                  Professional
                </th>
                <th className="text-center py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  <tr>
                    <td colSpan={4} className="py-4 px-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded">
                        {category.category}
                      </h4>
                    </td>
                  </tr>
                  {category.items.map((item, itemIndex) => (
                    <tr key={itemIndex} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof item.basic === 'boolean' ? (
                          item.basic ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">{item.basic}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof item.pro === 'boolean' ? (
                          item.pro ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">{item.pro}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof item.enterprise === 'boolean' ? (
                          item.enterprise ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">{item.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Need a custom solution? Contact our sales team.
        </p>
        <button className="btn-secondary">
          <Headphones className="w-4 h-4 mr-2" />
          Contact Sales
        </button>
      </div>
    </motion.div>
  )
}

export default UpgradePlan