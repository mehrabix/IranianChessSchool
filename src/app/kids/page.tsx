import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Sparkles, Star, Gamepad2, Smile, Heart, Shield, Users, Trophy, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Gamepad2, title: "Fun & Games", description: "Learn chess through interactive games, puzzles, and challenges designed for young minds." },
  { icon: Users, title: "Group Classes", description: "Weekly live classes with other kids at the same level. Learn together, grow together." },
  { icon: Trophy, title: "Achievements", description: "Earn badges, stars, and rewards as you progress through levels and master skills." },
  { icon: Smile, title: "Kid-Friendly Coaches", description: "Patient, experienced coaches who know how to make chess exciting for children." },
  { icon: Shield, title: "Safe Environment", description: "Parent dashboard, progress reports, and full supervision in all live sessions." },
  { icon: Star, title: "Proven Method", description: "Our curriculum is designed by child education specialists and titled chess coaches." },
];

const plans = [
  { name: "Standard", price: "$79", period: "/mo", features: ["Weekly group class", "Puzzle access", "Progress tracking", "Parent dashboard", "Community access"], cta: "Get Started" },
  { name: "Premium", price: "$249", period: "/mo", features: ["Everything in Standard", "2x weekly classes", "Monthly game review", "1-on-1 coaching session", "Priority support"], cta: "Go Premium", popular: true },
];

export default function KidsPage() {
  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-amber-50/50 via-background to-emerald-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <Container size="lg" className="relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Kids Program</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                Chess Lessons<br />
                <span className="text-emerald-600">Kids Love</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Give your child the gift of chess. Our kids program makes learning fun, 
                engaging, and effective with age-appropriate coaching and gamified lessons.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/20" render={<Link href="/pricing" />}>
                  Try Free <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8" render={<Link href="/faq" />}>
                  Learn More
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Ages 6–16</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> All levels welcome</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 7-day free trial</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-emerald-400/20 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-1 w-64 h-64">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const isDark = (row + col) % 2 === 1;
                      const isPiece = [0, 7].includes(row) && (col === 0 || col === 7);
                      return (
                        <div key={i} className={`aspect-square rounded-sm flex items-center justify-center text-lg ${
                          isDark ? 'bg-emerald-600/20' : 'bg-amber-100/40'
                        } ${isPiece ? 'text-xl' : ''}`}>
                          {isPiece && (row === 0 ? '♜♞♝♛♚♝♞♜'[col] : '♖♘♗♕♔♗♘♖'[col])}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Kids Love It</h2>
            <p className="text-lg text-muted-foreground">Designed for young learners, loved by parents</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                    <f.icon className="h-6 w-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-b from-amber-50/30 to-background">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Kids Plans</h2>
            <p className="text-lg text-muted-foreground">Choose the right plan for your child</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative border-2 overflow-visible ${plan.popular ? 'border-emerald-500 shadow-xl shadow-emerald-500/10' : 'border-border shadow-sm'} transition-shadow`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full h-11" variant={plan.popular ? "default" : "outline"} render={<Link href="/pricing" />}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white">
        <Container size="lg" className="text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Start your child&apos;s chess journey</h2>
          <p className="text-lg text-emerald-100/80">Give them the skills and confidence that chess provides. Join our kids program today.</p>
          <Button size="lg" variant="secondary" className="bg-white text-emerald-900 hover:bg-white/90 h-12 px-8 gap-2" render={<Link href="/pricing" />}>
            Try Free for 7 Days <ArrowRight className="h-4 w-4" />
          </Button>
        </Container>
      </section>
    </>
  );
}
