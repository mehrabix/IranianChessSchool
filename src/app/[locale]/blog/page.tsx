import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Sparkles, ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";

const posts = [
  { slug: "why-structured-learning", title: "Why Structured Learning Beats Random YouTube Videos", excerpt: "Most chess improvers waste years jumping between random content. Here's why a structured approach is the fastest path to 2000 Elo.", date: "Jan 15, 2025", readTime: "5 min", category: "Learning" },
  { slug: "top-5-beginner-mistakes", title: "Top 5 Mistakes Beginners Make (And How to Fix Them)", excerpt: "Avoid these common pitfalls that keep beginners stuck below 1000 Elo. Simple fixes that make a huge difference.", date: "Jan 10, 2025", readTime: "4 min", category: "Beginners" },
  { slug: "how-to-review-your-games", title: "How to Review Your Games Like a Grandmaster", excerpt: "Game analysis is the single most effective way to improve. Learn a systematic approach used by titled players.", date: "Jan 5, 2025", readTime: "7 min", category: "Analysis" },
  { slug: "opening-principles", title: "Opening Principles: What Every Player Should Know", excerpt: "Stop memorizing opening lines and start understanding principles. This guide covers everything you need for a solid opening repertoire.", date: "Dec 28, 2024", readTime: "6 min", category: "Openings" },
  { slug: "tactics-training-guide", title: "The Ultimate Tactics Training Guide", excerpt: "Tactics win games. Here's how to structure your puzzle training for maximum improvement, from beginner to advanced.", date: "Dec 20, 2024", readTime: "8 min", category: "Tactics" },
  { slug: "endgame-fundamentals", title: "Endgame Fundamentals: 5 Positions You Must Know", excerpt: "Master these essential endgame positions and watch your rating climb. Practical knowledge that wins games.", date: "Dec 15, 2024", readTime: "6 min", category: "Endgames" },
];

export default function BlogPage() {
  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <Container size="lg" className="relative text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Chess Improvement Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tips, strategies, and insights from our coaches to help you improve.</p>
        </Container>
      </section>

      <section className="py-20">
        <Container size="md">
          <div className="space-y-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> {post.date}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {post.readTime}</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                      Read more <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
