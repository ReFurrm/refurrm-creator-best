import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function MerchantGuidelines() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          ← Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Merchant Guidelines</CardTitle>
            <p className="text-muted-foreground">For users who sell products on the platform</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Product Quality</h2>
              <p>
                Sellers are responsible for ensuring their digital products are accurate, legal, and high quality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Ownership</h2>
              <p>Do not sell content you did not create or do not have rights to.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. Refunds</h2>
              <p>
                Creators set their own refund policies unless using platform-provided billing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Marketing</h2>
              <p>No false claims, misleading ads, or deceptive marketing practices.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. Customer Support</h2>
              <p>Creators must respond to buyer issues in a reasonable timeframe.</p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="font-semibold text-blue-900">
                Maintaining high standards helps build trust and grow your business on the platform.
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
