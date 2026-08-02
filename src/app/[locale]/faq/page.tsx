import { getTranslations } from 'next-intl/server';
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sparkles, BookOpen, CreditCard, Users, Clock, RefreshCw } from "lucide-react";

const faqSections = [
  { icon: BookOpen, categoryKey: 'general', items: ['whatIs', 'whoAreCoaches', 'needFarsi'] },
  { icon: CreditCard, categoryKey: 'pricing', items: ['howMuch', 'freeTrial', 'cancel'] },
  { icon: Users, categoryKey: 'coaching', items: ['liveClasses', 'gameReview', 'oneOnOne'] },
  { icon: Clock, categoryKey: 'time', items: ['timeNeeded', 'ownPace', 'improvement'] },
  { icon: RefreshCw, categoryKey: 'technical', items: ['requirements', 'importGames', 'mobileApp'] },
];

export default async function FAQPage() {
  const t = await getTranslations('faq');
  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <Container size="lg" className="relative text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {t('hero.badge')}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t('hero.heading')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('hero.subtitle')}</p>
        </Container>
      </section>

      <section className="py-20">
        <Container size="md">
          <div className="space-y-12">
            {faqSections.map((section) => (
              <div key={section.categoryKey}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">{t(`categories.${section.categoryKey}`)}</h2>
                </div>
                <Accordion className="space-y-3">
                  {section.items.map((faq) => (
                    <AccordionItem key={faq} value={faq} className="rounded-xl border bg-card">
                      <AccordionTrigger className="px-4 py-3 text-sm md:text-base font-medium hover:underline-offset-2">
                        {t(`questions.${faq}.q`)}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{t(`questions.${faq}.a`)}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
