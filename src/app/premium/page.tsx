import { Button } from '@/components/ui/Button';
import { Check, Star, Zap, UserCheck, BarChart } from 'lucide-react';

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic features for students getting started.",
    features: [
      "Access to all forums",
      "Basic chat features",
      "Upload/Download materials",
      "Basic AI Tutor (limited)",
      "Community support"
    ],
    cta: "Current Plan",
    current: true
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "per month",
    description: "Advanced features for serious learners.",
    features: [
      "Everything in Free",
      "Unlimited AI Tutor access",
      "Priority tutor booking",
      "Advanced analytics",
      "Ad-free experience",
      "Verified badge",
      "Exclusive study groups"
    ],
    cta: "Upgrade Now",
    current: false,
    highlight: true
  }
];

export default function PremiumPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade your learning experience</h1>
        <p className="text-xl text-gray-600">
          Get unlimited access to AI tutoring, priority booking, and advanced insights with Premium.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`rounded-2xl p-8 border shadow-sm relative ${
              plan.highlight 
                ? 'bg-white border-blue-200 ring-2 ring-blue-500 shadow-lg' 
                : 'bg-white'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
            )}
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-500 ml-2">/ {plan.period}</span>
            </div>
            <p className="text-gray-600 mb-6">{plan.description}</p>
            
            <Button 
              className="w-full mb-8" 
              variant={plan.highlight ? 'primary' : 'outline'}
              disabled={plan.current}
            >
              {plan.cta}
            </Button>
            
            <div className="space-y-4">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why go Premium?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Unlimited AI</h3>
            <p className="text-gray-600 text-sm">24/7 access to our advanced AI tutor without any usage limits.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
              <UserCheck className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Priority Booking</h3>
            <p className="text-gray-600 text-sm">Get first dibs on top-rated tutors and exclusive study sessions.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
              <BarChart className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Deep Insights</h3>
            <p className="text-gray-600 text-sm">Detailed analytics on your learning progress and performance.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-yellow-600">
              <Star className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Exclusive Content</h3>
            <p className="text-gray-600 text-sm">Access premium study materials and verified expert notes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
