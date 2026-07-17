import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import {
  ChessKnight, BookOpen, Users, Trophy, BarChart3, MessageCircle,
  Target, Sparkles, ChevronRight, Star, CheckCircle2, GraduationCap,
  LineChart, Shield, Clock, ArrowRight, Globe
} from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Structured Lessons', description: 'Complete training program from 0–2000 Elo with step-by-step curriculum', color: 'from-emerald-500/20 to-emerald-500/5' },
  { icon: Users, title: 'Live Group Classes', description: 'Weekly interactive sessions with titled coaches in small groups', color: 'from-blue-500/20 to-blue-500/5' },
  { icon: Trophy, title: 'Game Reviews', description: 'Deep personalized analysis of your games with FM/WGM coaches', color: 'from-amber-500/20 to-amber-500/5' },
  { icon: BarChart3, title: 'Progress Analytics', description: 'Track Elo, puzzle rating, lesson completion & weakness analysis', color: 'from-violet-500/20 to-violet-500/5' },
  { icon: MessageCircle, title: 'Vibrant Community', description: 'Join 1200+ improvers. Discuss, share, and grow together', color: 'from-rose-500/20 to-rose-500/5' },
  { icon: ChessKnight, title: 'AI-Powered Tools', description: 'Stockfish analysis, AI coach, opening explorer & daily puzzles', color: 'from-cyan-500/20 to-cyan-500/5' },
];

const levels = [
  { name: 'Beginner', range: '0–500', desc: 'Learn rules & basic tactics' },
  { name: 'Improver', range: '500–800', desc: 'Build strategic foundation' },
  { name: 'Intermediate', range: '800–1200', desc: 'Master key patterns' },
  { name: 'Advanced', range: '1200–1600', desc: 'Deep positional play' },
  { name: 'Club Player', range: '1600–2000', desc: 'Tournament preparation' },
];

const stats = [
  { value: '1200+', label: 'Students Improving', icon: Users },
  { value: '500+', label: 'Hours of Content', icon: BookOpen },
  { value: '2M+', label: 'Global Reach', icon: Globe },
  { value: '97%', label: 'Satisfaction Rate', icon: Sparkles },
];

export default async function HomePage() {
  const t = await getTranslations('home');
  return (
    <>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <Container size="xl" className="relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-emerald-50/50 text-sm font-medium text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Now accepting students worldwide
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                Master the Game,
                <span className="block text-emerald-600 mt-2">Think Deeper</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Stop jumping between random YouTube videos and blitz games.
                Follow a structured curriculum designed by titled coaches
                that actually <span className="font-semibold text-foreground">builds real chess understanding</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/pricing">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8">
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8">
                    See How It Works
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 7-day free trial</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cancel anytime</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-amber-400/20 rounded-3xl rotate-6" />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 to-amber-400/10 rounded-3xl -rotate-3" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-0.5 w-72 h-72">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const isDark = (row + col) % 2 === 1;
                      const isKnight = (row === 0 && col === 1) || (row === 7 && col === 6);
                      return (
                        <div key={i} className={`aspect-square flex items-center justify-center text-xs ${
                          isDark ? 'bg-emerald-800/30' : 'bg-amber-50/40'
                        } ${isKnight ? 'text-2xl' : ''}`}>
                          {isKnight && (row === 0 ? '♞' : '♘')}
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

      <section className="py-16 md:py-20 border-y bg-card/50">
        <Container size="lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <stat.icon className="h-5 w-5 mx-auto text-emerald-500" />
                <p className="text-3xl md:text-4xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              More Than Just a Course
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to go from beginner to club player in one integrated platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-b from-emerald-50/30 to-background">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">Structured Path</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Training Levels
            </h2>
            <p className="text-lg text-muted-foreground">
              From your first move to tournament play — a clear roadmap
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {levels.map((level, i) => (
              <div key={level.name} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-sm font-bold text-emerald-700">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{level.name}</h3>
                  <p className="text-2xl font-bold text-emerald-600">{level.range}</p>
                  <p className="text-sm text-muted-foreground">{level.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Why Students Choose Us
              </h2>
              <p className="text-lg text-muted-foreground">
                Real results from real students
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Roman', gain: '+1045', text: 'The marginal gains from consistent training really add up over time.', rating: '1200 → 2245' },
                { name: 'Annabella', gain: '+1007', text: 'Thanks to Dina and the community I gained 400 Elo while I was here.', rating: '597 → 1604' },
                { name: 'Grace', gain: '+614', text: 'I won the women\'s prize in my section at the Toronto Open.', rating: '1400 → 2014' },
              ].map((student) => (
                <Card key={student.name} className="border-0 bg-gradient-to-b from-emerald-50/50 to-background shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      &ldquo;{student.text}&rdquo;
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="font-semibold text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.rating}</p>
                      </div>
                      <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
                        {student.gain} points
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
        <Container size="lg" className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to Transform Your Chess?
          </h2>
          <p className="text-lg text-emerald-100/80 max-w-xl mx-auto">
            Join 1200+ students already improving with our structured program.
            Start your 7-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pricing">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base gap-2 bg-white text-emerald-900 hover:bg-white/90">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto h-12 px-8 text-base text-white/80 hover:text-white hover:bg-white/10">
                View FAQ
              </Button>
            </Link>
          </div>
          <p className="text-sm text-emerald-100/60">No commitment. Cancel anytime. Free for 7 days.</p>
        </Container>
      </section>
    </>
  );
}
