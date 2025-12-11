import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      icon: Sparkles,
      description: 'Perfect for getting started',
      price: 5.99,
      features: [
        { name: 'Up to 3 products', included: true },
        { name: 'Basic storefront', included: true },
        { name: 'Email support', included: true },
        { name: 'Analytics dashboard', included: false },
        { name: 'Custom domain', included: false },
        { name: 'Priority support', included: false },
        { name: 'Advanced integrations', included: false },
      ],
      cta: 'Start Now',
      popular: false,
    },
    {
      name: 'Pro',
      icon: Zap,
      description: 'For growing businesses',
      price: 39.99,
      features: [
        { name: 'Up to 20 products', included: true },
        { name: 'Advanced storefront', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Analytics dashboard', included: true },
        { name: 'Custom domain', included: true },
        { name: 'AI email generator', included: true },
        { name: 'Advanced integrations', included: true },
      ],
      cta: 'Start Now',
      popular: true,
    },
    {
      name: 'Enterprise',
      icon: Crown,
      description: 'For large organizations',
      price: 99,
      features: [
        { name: 'Unlimited products', included: true },
        { name: 'Up to 4 custom domains', included: true },
        { name: '24/7 phone support', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'White-label solution', included: true },
        { name: 'AI tools suite', included: true },
        { name: 'Dedicated account manager', included: true },
      ],
      cta: 'Start Now',
      popular: false,
    },
  ];

  const handleSelectPlan = (planName: string) => {
    navigate(`/signup?plan=${planName.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-500 text-white px-4 py-1 text-sm">
            No Cost to Start - Create Your Account Free
          </Badge>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Choose the perfect plan for your business
          </p>
          <p className="text-sm text-slate-500">
            Start creating products today. Subscribe when you're ready to publish.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  plan.popular ? 'ring-4 ring-purple-600 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                </div>
                
                <p className="text-slate-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">
                    ${plan.price}
                  </span>
                  <span className="text-slate-600">/mo</span>
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-6 text-lg font-semibold ${
                    plan.popular
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {plan.cta}
                </Button>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
