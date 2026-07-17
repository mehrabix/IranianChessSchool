import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChessKnight, BookOpen, Users, Trophy, BarChart3, MessageCircle } from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Structured Lessons', description: 'Complete training program from 0–2000 Elo' },
  { icon: Users, title: 'Group Classes', description: 'Weekly live classes with titled coaches' },
  { icon: Trophy, title: 'Game Reviews', description: 'Personalized game analysis with coaches' },
  { icon: BarChart3, title: 'Progress Tracking', description: 'Track your rating, puzzles, and lessons' },
  { icon: MessageCircle, title: 'Community', description: 'Supportive learning community' },
  { icon: ChessKnight, title: 'Puzzles & Analysis', description: 'Stockfish-powered analysis and puzzles' },
];

const levels = [
  { name: 'Beginner', range: '0–500' },
  { name: 'Improver', range: '500–800' },
  { name: 'Intermediate', range: '800–1200' },
  { name: 'Advanced', range: '1200–1600' },
  { name: 'Club Player', range: '1600–2000' },
];

export default function HomePage() {
  return (
    <>
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Iranian Chess School
            </h1>
            <p className="text-xl text-muted-foreground">
              by WGM Dina Belenkaya
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Structured lessons, game reviews, homework, practical play, and coaching.
              We don't believe in memorizing endless opening lines. We teach you how to use your brain.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg">Try for Free</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold">1200+</p>
              <p className="text-sm text-muted-foreground">students improving</p>
            </div>
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground">hours of training material</p>
            </div>
            <div>
              <p className="text-3xl font-bold">2M+</p>
              <p className="text-sm text-muted-foreground">chess players reached</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">More Than Just a Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-8">Training Levels</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {levels.map((level) => (
              <Badge key={level.name} variant="secondary" className="text-base px-4 py-2">
                {level.name} ({level.range})
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Chess?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 1200+ students who are already improving with our structured program.
          </p>
          <Link href="/pricing">
            <Button size="lg">Start Your Free Trial</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
