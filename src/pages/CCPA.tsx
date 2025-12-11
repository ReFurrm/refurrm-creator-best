import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CCPA() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">CCPA Notice</h1>
          <p className="text-sm text-muted-foreground mb-2">California Consumer Privacy Act</p>
          <p className="text-sm text-muted-foreground mb-8">Applies to California residents</p>

          <div className="space-y-6 prose prose-sm max-w-none">
            <p>This notice supplements the ReFURRM Ai Studio Privacy Policy.</p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Your Rights Under CCPA</h2>
              <p>California users have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>request the categories of personal data collected</li>
                <li>request deletion of personal data</li>
                <li>request the specific pieces of data collected</li>
                <li>request information on data sharing</li>
                <li>request to opt out of data selling (we do not sell data)</li>
                <li>not be discriminated against for exercising privacy rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Categories of Data Collected</h2>
              <p>We may collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>identifiers (name, email)</li>
                <li>commercial information (subscriptions, product activity)</li>
                <li>internet activity (usage logs)</li>
                <li>user generated content (uploads)</li>
                <li>technical data (device and browser info)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Sharing</h2>
              <p>We may share data with service providers such as:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Supabase</li>
                <li>Stripe</li>
                <li>Email service providers</li>
                <li>Analytics platforms</li>
              </ul>
              <p className="mt-2 font-semibold">We do not sell personal data.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Requests</h2>
              <p>Users may submit a CCPA request through support. We may verify identity before fulfilling requests.</p>
              <p className="mt-2">Contact: support@refurrm.app | 479.446.6201</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
