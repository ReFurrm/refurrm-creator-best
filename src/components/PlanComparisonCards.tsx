import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlanComparisonCardsProps {
  currentPlan: string;
  isVip?: boolean;
}


export default function PlanComparisonCards({ currentPlan, isVip }: PlanComparisonCardsProps) {
  const navigate = useNavigate();

  // Don't show plan options if user is VIP
  if (isVip) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>VIP Premium Access</CardTitle>
          <CardDescription>You have unlimited access to all features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-purple-500 rounded-lg p-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-2xl text-purple-900">VIP Premium</h3>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">Special Access</Badge>
            </div>
            <p className="text-4xl font-bold mb-4 text-purple-900">Free<span className="text-sm text-gray-600">/forever</span></p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-purple-600" />
                Unlimited Products
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-purple-600" />
                Unlimited Customers
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-purple-600" />
                Unlimited Emails
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-purple-600" />
                Unlimited Bookings
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-purple-600" />
                All AI Tools & Features
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-purple-600" />
                Priority Support
              </li>
            </ul>
            <p className="text-sm text-gray-600 italic">Thank you for being a valued member of our community!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const plans = [
    {
      name: 'Starter',
      price: 9,
      features: ['10 Products', '100 Customers', '500 Emails/mo', 'Basic Analytics']
    },
    {
      name: 'Pro',
      price: 29,
      features: ['100 Products', '1000 Customers', '5000 Emails/mo', 'Advanced Analytics', 'AI Tools']
    },
    {
      name: 'Enterprise',
      price: 99,
      features: ['Unlimited Products', 'Unlimited Customers', 'Unlimited Emails', 'Priority Support', 'Custom Features']
    }
  ];


  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Plans</CardTitle>
        <CardDescription>Upgrade or downgrade your subscription</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className="border rounded-lg p-4 relative">
              {currentPlan === plan.name.toLowerCase() && (
                <Badge className="absolute top-2 right-2">Current</Badge>
              )}
              <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4">${plan.price}<span className="text-sm text-gray-500">/mo</span></p>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={currentPlan === plan.name.toLowerCase() ? 'outline' : 'default'}
                disabled={currentPlan === plan.name.toLowerCase()}
                onClick={() => navigate('/pricing')}
              >
                {currentPlan === plan.name.toLowerCase() ? 'Current Plan' : 'Select Plan'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
