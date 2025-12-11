import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CommunityGuidelines() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          ← Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Community Guidelines</CardTitle>
            <p className="text-muted-foreground">These rules help keep the platform safe and productive.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Respect</h2>
              <p>No harassment, hate speech, threats, or abusive behavior.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Legal Content Only</h2>
              <p>No illegal, harmful, or prohibited material.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. No Exploitation</h2>
              <p>No adult content involving minors. No violent or hateful content.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
              <p>Do not upload copyrighted content you do not have rights to use.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. No Scams or Fraud</h2>
              <p>No deceptive marketing, fake offers, or impersonation.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. No System Abuse</h2>
              <p>No spam, botting, scraping, or misuse of AI systems.</p>
            </section>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <p className="font-semibold text-yellow-900">
                Violations may result in suspension or termination.
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
