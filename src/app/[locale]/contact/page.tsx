'use client';

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Sparkles, Mail, MessageSquare, Send, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        subject: form.get('subject'),
        message: form.get('message'),
      }),
    });
    setSubmitted(true);
  };

  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <Container size="lg" className="relative text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {t('hero.badge')}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t('hero.heading')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('hero.subtitle')}</p>
        </Container>
      </section>

      <section className="py-20">
        <Container size="md">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">{t('form.heading')}</h2>
              {submitted ? (
                <div className="p-8 rounded-2xl border bg-emerald-50/50 text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500" />
                  <h3 className="text-lg font-semibold">{t('form.successTitle')}</h3>
                  <p className="text-sm text-muted-foreground">{t('form.successText')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">{t('form.name')}</label>
                      <Input id="name" required placeholder={t('form.namePlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">{t('form.email')}</label>
                      <Input id="email" type="email" required placeholder={t('form.emailPlaceholder')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">{t('form.subject')}</label>
                    <Input id="subject" required placeholder={t('form.subjectPlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">{t('form.message')}</label>
                    <textarea id="message" required rows={5} className="w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder={t('form.messagePlaceholder')} />
                  </div>
                  <Button type="submit" className="w-full h-11 gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/20">
                    {t('form.submit')} <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">{t('info.heading')}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{t('info.email')}</h3>
                    <a href="mailto:info@iranianchessschool.com" className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors">{t('info.emailAddress')}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{t('info.whatsapp')}</h3>
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors">{t('info.phone')}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{t('info.location')}</h3>
                    <p className="text-sm text-muted-foreground">{t('info.locationText')}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl border bg-muted/30">
                <h3 className="font-semibold mb-2">{t('info.followUs')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('info.followUsText')}</p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-2" render={<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" />}>{t('info.instagram')}</Button>
                  <Button variant="outline" size="sm" className="gap-2" render={<a href="https://youtube.com" target="_blank" rel="noopener noreferrer" />}>{t('info.youtube')}</Button>
                  <Button variant="outline" size="sm" className="gap-2" render={<a href="https://t.me" target="_blank" rel="noopener noreferrer" />}>{t('info.telegram')}</Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
