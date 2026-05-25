"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$19",
    description: "Perfect for new creators just starting out.",
    features: [
      "AI Content Ideas (50/mo)",
      "Viral Hook Generator",
      "Thumbnail CTR Analyzer (10/mo)",
      "Basic Analytics Dashboard",
    ],
    buttonText: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    description: "Everything you need to scale your audience.",
    features: [
      "Unlimited Content Ideas",
      "Unlimited Hook & Script Generation",
      "Thumbnail CTR Analyzer (100/mo)",
      "Advanced Predictive Analytics",
      "AI Growth Coach Chatbot",
      "Content Calendar Scheduling",
    ],
    buttonText: "Get Pro",
    popular: true,
  },
  {
    name: "Agency",
    price: "$149",
    description: "For agencies managing multiple creators.",
    features: [
      "Everything in Pro",
      "Manage up to 10 Profiles",
      "Unlimited Thumbnail Analysis",
      "White-label Reports",
      "Priority API Access",
      "Dedicated Success Manager",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your growth stage. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl glass-card flex flex-col ${
                plan.popular ? "border-primary shadow-[0_0_40px_rgba(139,92,246,0.3)]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                  {plan.price}
                  <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <p className="ml-3 text-sm text-muted-foreground">{feature}</p>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                plan.popular 
                  ? "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/25" 
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
