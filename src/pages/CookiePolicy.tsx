import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          ← Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Cookie Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Effective Date: November 25, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              ReFURRM Ai Studio uses cookies to improve your browsing experience, support login sessions, 
              and gather basic analytics.
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-2">Types of Cookies</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Essential cookies (login, security, platform functions)</li>
                <li>Preference cookies (language, saved settings)</li>
                <li>Analytics cookies</li>
                <li>Marketing and tracking cookies (only if enabled)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Managing Cookies</h2>
              <p>
                Users may accept all cookies, decline non-essential cookies, or manage preferences 
                through the cookie consent banner.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Third-Party Cookies</h2>
              <p>
                Service providers such as Supabase, Stripe, or analytics tools may place their own cookies.
              </p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="font-semibold text-blue-900">
                You can control cookie settings through your browser preferences at any time.
              </p>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Contact: <a href="mailto:support@refurrm.app" className="text-blue-600 hover:underline">support@refurrm.app</a> | 
                Phone: 479.446.6201
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
