import { Pricing } from "./pricing/pricing";

const pricingPlans = [
  {
    name: "Smart",
    price: "10",
    yearlyPrice: "9", // ~20% discount
    period: "per month",
    description: "Best for individuals & small households",
    features: [
      "Limited Acccess",
      "Professional Home services",
      "Up to 12 service per month",
      "Standard response time",

    ],
    buttonText: "Get Started",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "Smarter",
    price: "100",
    yearlyPrice: "90", // ~20% discount
    period: "per month",
    description: "Best for families & frequent service users",
    features: [
      "Unlimited Access",
      "Access to all service categories",
      "",
      "Faster provider response time",
      "Up to 100 service requests per month",
      "Service history & basic tracking",
      "Family account (multiple addresses)",
      "Discounted service charges",
      "Advanced service history & reports",
      "Onboarding: $499 onboarding & training package (waived with annual billing)",
    ],
    buttonText: "Get Started",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "Smartest",
    price: "200",
    yearlyPrice: "180", // ~20% discount
    period: "per month",
    description: "Best for offices, landlords & property managers",
    features: [
      "Everything in Professional",
      "Unlimited service requests",
      "Priority booking for urgent services",
      "Bulk & recurring service bookings",
      "Multiple property management dashboard",
      "Dedicated support channel",
      "Custom pricing for large jobs",
      "Invoices & service reports",
      "API access & integrations",
      "Dedicated account manager",
      "Onboarding: $1,500+ implementation package including full setup, data migration & team training",
    ],
    buttonText: "Get Started",
    href: "/contact",
    isPopular: false,
  },
];

function PricingBasic() {
  return (
    <div className="rounded-lg">
      <Pricing
        plans={pricingPlans}
        title="Simple, Transparent Pricing"
        description={
          "Choose the plan that fits your service needs.\nAll plans include verified providers, secure payments, and reliable customer support."
        }
      />
    </div>
  );
}

export { PricingBasic };
