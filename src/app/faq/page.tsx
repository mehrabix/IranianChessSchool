import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Sparkles, ChevronDown, HelpCircle, BookOpen, CreditCard, Users, Clock, RefreshCw } from "lucide-react";

const faqs = [
  {
    icon: BookOpen,
    category: "General",
    items: [
      { q: "What is Iranian Chess School?", a: "Iranian Chess School is a comprehensive online chess training platform with structured courses, live classes, game reviews, puzzles, and a supportive community. We help players from absolute beginners to 2000+ Elo improve their game." },
      { q: "Who are the coaches?", a: "Our coaches are titled players including FIDE Masters and Woman Grandmasters with years of teaching experience. They provide personalized feedback and lead live group sessions." },
      { q: "Do I need to know Farsi?", a: "No, all content is available in English. However, our coaches are fluent in both English and Farsi to serve our international community." },
    ],
  },
  {
    icon: CreditCard,
    category: "Pricing & Plans",
    items: [
      { q: "How much does it cost?", a: "We offer three plans: Standard ($29/mo), Premium ($49/mo), and VIP ($199/mo). We also have specialized kids plans. Annual billing gives you 2 months free." },
      { q: "Is there a free trial?", a: "Yes! We offer a 7-day free trial on all plans. No credit card required. You can cancel anytime during the trial at no cost." },
      { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription at any time. Your access continues until the end of your billing period. No cancellation fees." },
    ],
  },
  {
    icon: Users,
    category: "Classes & Coaching",
    items: [
      { q: "How do live classes work?", a: "Live group classes are held weekly via video conferencing. Each session focuses on specific themes and includes Q&A. Premium and VIP members get priority access." },
      { q: "What is a game review session?", a: "You submit your game (PGN or Chess.com/Lichess link) and a coach analyzes it move-by-move, explaining mistakes, better alternatives, and key learning points." },
      { q: "How do I book 1-on-1 coaching?", a: "VIP members can book 1-on-1 sessions directly through our booking system. Premium members get monthly sessions. Sessions are conducted via video call." },
    ],
  },
  {
    icon: Clock,
    category: "Time Commitment",
    items: [
      { q: "How much time do I need?", a: "We recommend 3–5 hours per week for optimal progress. This includes watching lessons, solving puzzles, playing games, and reviewing with coaches." },
      { q: "Can I learn at my own pace?", a: "Yes! All course materials are available on-demand. You can watch lessons, solve puzzles, and study at whatever pace works for you." },
      { q: "How long until I see improvement?", a: "Most students see noticeable improvement within 4–6 weeks of consistent training. Many gain 100–200 Elo in their first 3 months." },
    ],
  },
  {
    icon: RefreshCw,
    category: "Technical",
    items: [
      { q: "What do I need to get started?", a: "A computer or tablet with internet access. For live classes, you need a camera and microphone. The platform works on all modern browsers." },
      { q: "Can I import games from Chess.com or Lichess?", a: "Yes! You can import games from both Chess.com and Lichess by entering your username. We also support PGN file upload." },
      { q: "Do you have a mobile app?", a: "The platform is fully responsive and works great on mobile browsers. A native mobile app is in development." },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <Container size="lg" className="relative text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> FAQ</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to know about Iranian Chess School</p>
        </Container>
      </section>

      <section className="py-20">
        <Container size="md">
          <div className="space-y-12">
            {faqs.map((section) => (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">{section.category}</h2>
                </div>
                <div className="space-y-3">
                  {section.items.map((faq) => (
                    <details key={faq.q} className="group rounded-xl border bg-card hover:shadow-sm transition-shadow">
                      <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                        <span className="font-medium text-sm md:text-base pr-4">{faq.q}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
