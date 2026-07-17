import Link from 'next/link';
import { ChessKnight, Video, Camera, MessageCircle, Send, Mail, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/container';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/kids', label: 'Kids' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/pricing', label: 'Pricing' },
];

const socialLinks = [
  { href: '#', label: 'YouTube', icon: Video },
  { href: '#', label: 'Instagram', icon: Camera },
  { href: '#', label: 'Discord', icon: MessageCircle },
  { href: '#', label: 'Telegram', icon: Send },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <Container size="lg" className="py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <ChessKnight className="h-5 w-5 text-primary" />
              Iranian Chess School
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Master the game, think deeper. Structured chess training for all levels with real coaches and a supportive community.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Quick Links</h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    {link.label}
                    <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Follow Us</h3>
            <div className="flex flex-col gap-2.5">
              {socialLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <link.icon className="size-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Contact</h3>
            <div className="space-y-2.5">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                info@iranianchessschool.com
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Iranian Chess School. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
