import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Sparkles, CheckCircle2, ArrowRight, Star, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Standard",
    price: "$29",
    period: "/mo",
    description: "Perfect for self-motivated learners",
    icon: Star,
    features: [
      "Full course library access",
      "Puzzle system with rating",
      "Community read access",
      "Basic game analysis",
      "Progress tracking",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Premium",
    price: "$49",
    period: "/mo",
    description: "Best for serious improvers",
    icon: Zap,
    features: [
      "Everything in Standard",
      "Weekly live group classes",
      "Monthly game review session",
      "Advanced analysis tools",
      "Community participation",
      "Priority email support",
    ],
    cta: "Go Premium",
    popular: true,
  },
  {
    name: "VIP",
    price: "$199",
    period: "/mo",
    description: "For those who want it all",
    icon: Crown,
    features: [
      "Everything in Premium",
      "Weekly 1-on-1 coaching",
      "Weekly game reviews with Dina",
      "Priority booking & support",
      "Personal study plan",
      "Direct coach messaging",
    ],
    cta: "Go VIP",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <Container size="lg" className="relative text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Start free. Upgrade when you&apos;re ready.</p>
        </Container>
      </section>

      <section className="py-20">
        <Container size="lg">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative flex flex-col border-2 overflow-visible ${plan.popular ? 'border-emerald-500 shadow-xl shadow-emerald-500/10' : 'border-border shadow-sm'} transition-shadow`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8 pb-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-1">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-6 pt-8">
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full h-11 gap-2" variant={plan.popular ? "default" : "outline"} render={<Link href="/auth/register" />}>
                    {plan.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              All plans include a 7-day free trial. No credit card required. Cancel anytime.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-b from-emerald-50/30 to-background">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Compare plans</h2>
            <p className="text-lg text-muted-foreground">Find the perfect plan for your level</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full max-w-3xl mx-auto text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 font-semibold">Standard</th>
                  <th className="text-center py-4 px-4 font-semibold text-emerald-600">Premium</th>
                  <th className="text-center py-4 px-4 font-semibold">VIP</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Basic lessons (Level 1)", free: "✓", std: "✓", prem: "✓", vip: "✓" },
                  { name: "All courses", free: "✗", std: "✓", prem: "✓", vip: "✓" },
                  { name: "Puzzle access", free: "Limited", std: "✓", prem: "✓", vip: "✓" },
                  { name: "Community access", free: "Read-only", std: "✓", prem: "✓", vip: "✓" },
                  { name: "Game analysis", free: "✗", std: "Basic", prem: "Advanced", vip: "Advanced" },
                  { name: "Group classes", free: "✗", std: "✗", prem: "Weekly", vip: "Weekly" },
                  { name: "Game reviews", free: "✗", std: "✗", prem: "Monthly", vip: "Weekly" },
                  { name: "1-on-1 coaching", free: "✗", std: "✗", prem: "Monthly", vip: "Weekly (4x/mo)" },
                ].map((row) => (
                  <tr key={row.name} className="border-b last:border-0">
                    <td className="py-3 px-4">{row.name}</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{row.free}</td>
                    <td className="text-center py-3 px-4">{row.std}</td>
                    <td className="text-center py-3 px-4 text-emerald-600 font-medium">{row.prem}</td>
                    <td className="text-center py-3 px-4">{row.vip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white">
        <Container size="lg" className="text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Not sure which plan is right?</h2>
          <p className="text-lg text-emerald-100/80">Start with our 7-day free trial. No commitment, no credit card needed.</p>
          <Button size="lg" variant="secondary" className="bg-white text-emerald-900 hover:bg-white/90 h-12 px-8 gap-2" render={<Link href="/auth/register" />}>
            Try Free for 7 Days <ArrowRight className="h-4 w-4" />
          </Button>
        </Container>
      </section>
    </>
  );
}
