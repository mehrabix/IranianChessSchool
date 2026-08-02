import { Link } from '@/i18n/routing';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-8xl font-bold text-muted-foreground/20">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}
