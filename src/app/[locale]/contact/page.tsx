'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Sparkles, Mail, MessageSquare, Send, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <Container size="lg" className="relative text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Contact</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Have a question? We&apos;d love to hear from you.</p>
        </Container>
      </section>

      <section className="py-20">
        <Container size="md">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">Send us a message</h2>
              {submitted ? (
                <div className="p-8 rounded-2xl border bg-emerald-50/50 text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500" />
                  <h3 className="text-lg font-semibold">Message sent!</h3>
                  <p className="text-sm text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input id="name" required placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" type="email" required placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" required placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea id="message" required rows={5} className="w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Tell us more..." />
                  </div>
                  <Button type="submit" className="w-full h-11 gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/20">
                    Send Message <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Email</h3>
                    <a href="mailto:info@iranianchessschool.com" className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors">info@iranianchessschool.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">WhatsApp</h3>
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors">+1 (234) 567-890</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Location</h3>
                    <p className="text-sm text-muted-foreground">Online — Worldwide</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl border bg-muted/30">
                <h3 className="font-semibold mb-2">Follow us</h3>
                <p className="text-sm text-muted-foreground mb-4">Stay connected on social media for tips, updates, and community events.</p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-2" render={<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" />}>Instagram</Button>
                  <Button variant="outline" size="sm" className="gap-2" render={<a href="https://youtube.com" target="_blank" rel="noopener noreferrer" />}>YouTube</Button>
                  <Button variant="outline" size="sm" className="gap-2" render={<a href="https://t.me" target="_blank" rel="noopener noreferrer" />}>Telegram</Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
