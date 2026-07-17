import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChessKnight, Video, Camera, MessageCircle, Send, Mail, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/container';

const footerNavLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/about', labelKey: 'about' },
  { href: '/kids', labelKey: 'kids' },
  { href: '/faq', labelKey: 'faq' },
  { href: '/blog', labelKey: 'blog' },
  { href: '/contact', labelKey: 'contact' },
  { href: '/pricing', labelKey: 'pricing' },
];

export default async function Footer() {
  const tnav = await getTranslations('nav');
  const tfooter = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <Container size="lg" className="py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <ChessKnight className="h-5 w-5 text-primary" />
              {tfooter('brand')}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tfooter('description')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">{tfooter('quickLinks')}</h3>
            <ul className="space-y-2.5">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    {tnav(link.labelKey)}
                    <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">{tfooter('followUs')}</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { key: 'YouTube', icon: Video },
                { key: 'Instagram', icon: Camera },
                { key: 'Discord', icon: MessageCircle },
                { key: 'Telegram', icon: Send },
              ].map((link) => (
                <Link key={link.key} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <link.icon className="size-4" />
                  {link.key}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">{tfooter('contact')}</h3>
            <div className="space-y-2.5">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                {tfooter('email')}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t text-center text-sm text-muted-foreground">
          {tfooter('copyright', { year: year.toString() })}
        </div>
      </Container>
    </footer>
  );
}
