import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function BetaTesterAgreement() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          ← Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Beta Tester Agreement</CardTitle>
            <p className="text-muted-foreground">For early access users</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Purpose</h2>
              <p>Beta testers receive early access to features for testing.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Confidentiality</h2>
              <p>
                You agree not to share screenshots, features, or internal tools without approval.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. No Warranty</h2>
              <p>Beta features may contain bugs or errors.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Feedback</h2>
              <p>
                Feedback may be used to improve the platform without compensation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
              <p>Access may be revoked at any time.</p>
            </section>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
              <p className="font-semibold text-purple-900">
                Thank you for helping us build a better platform! Your feedback is invaluable.
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
