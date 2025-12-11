import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function EULA() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          ← Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">End User License Agreement (EULA)</CardTitle>
            <p className="text-sm text-muted-foreground">Effective Date: November 25, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">
              This EULA governs the use of ReFURRM Ai Studio software.
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-2">1. License Grant</h2>
              <p>
                We grant you a non-exclusive, non-transferable, revocable license to use the platform 
                for creating and selling digital products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Ownership</h2>
              <p>
                ReFURRM Ai Studio owns the software, codebase, and platform infrastructure. You own 
                the content you upload and the content you sell.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. Restrictions</h2>
              <p>You may not:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>copy or modify platform code</li>
                <li>resell or sublicense access</li>
                <li>remove branding or proprietary notices</li>
                <li>use the software to compete directly with the platform</li>
                <li>attempt unauthorized access to systems or databases</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Updates</h2>
              <p>We may update, patch, or modify features at any time.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
              <p>We may terminate access for violations of the EULA or Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Disclaimer</h2>
              <p>Software is provided as is without warranties of any kind.</p>
            </section>

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
