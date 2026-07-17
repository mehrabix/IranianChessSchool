import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ChessKnight, Target, Users, Award, BookOpen, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const coaches = [
  { name: "Dina", title: "Head Coach — FM", bio: "FIDE Master with 15+ years of coaching experience. Specializes in positional play and endgames.", image: "/coaches/dina.jpg", fide: "https://ratings.fide.com/profile/12500540" },
  { name: "Alexandra", title: "Coach — WGM", bio: "Women's Grandmaster with a passion for tactical training. Coaches intermediate to advanced students.", image: "/coaches/alexandra.jpg", fide: "https://ratings.fide.com/profile/13500010" },
];

const values = [
  { icon: Target, title: "Structured Learning", description: "No more random YouTube videos. Follow a proven curriculum designed by titled coaches." },
  { icon: Users, title: "Personal Attention", description: "Small group classes and 1-on-1 coaching ensure every student gets the help they need." },
  { icon: Award, title: "Proven Results", description: "Our students have gained 200–1000+ Elo points through our systematic approach." },
  { icon: BookOpen, title: "Lifetime Access", description: "Learn at your own pace. All course materials are available 24/7." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <Container size="lg" className="relative text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Mission</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe every chess player deserves access to world-class coaching. 
            Iranian Chess School brings together titled coaches, structured curriculum, 
            and a supportive community to help you reach your full potential.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Values</h2>
            <p className="text-lg text-muted-foreground">What makes us different</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                    <v.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{v.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-b from-emerald-50/30 to-background">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Meet Our Coaches</h2>
            <p className="text-lg text-muted-foreground">Learn from the best in the game</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {coaches.map((coach) => (
              <Card key={coach.name} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="aspect-[3/2] bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                  <ChessKnight className="h-20 w-20 text-emerald-300" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{coach.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{coach.title}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{coach.bio}</p>
                  <Button variant="outline" size="sm" render={<a href={coach.fide} target="_blank" rel="noopener noreferrer" />}>
                    FIDE Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white">
        <Container size="lg" className="text-center space-y-8 max-w-3xl mx-auto">
          <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-300" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to start your journey?</h2>
          <p className="text-lg text-emerald-100/80">Join 1200+ students who are already improving with our structured program.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-900 hover:bg-white/90 h-12 px-8 gap-2" render={<Link href="/pricing" />}>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 h-12 px-8" render={<Link href="/contact" />}>
              Contact Us
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
