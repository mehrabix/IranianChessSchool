import Link from 'next/link';
import { ChessKnight } from 'lucide-react';

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
  { href: '#', label: 'YouTube' },
  { href: '#', label: 'Instagram' },
  { href: '#', label: 'Discord' },
  { href: '#', label: 'Telegram' },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <ChessKnight className="h-5 w-5" />
              Iranian Chess School
            </Link>
            <p className="text-sm text-muted-foreground">
              Master the game, think deeper. Structured chess training for all levels.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Email: info@iranianchessschool.com
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Iranian Chess School. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
