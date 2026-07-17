import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>Something went wrong during sign in</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">Please try again or contact support if the problem persists.</p>
          <Link href="/auth/signin">
            <Button>Try Again</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
