import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DPA() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">Data Processing Agreement</h1>
          <p className="text-sm text-muted-foreground mb-8">Effective Date: November 25, 2025</p>

          <div className="space-y-6 prose prose-sm max-w-none">
            <p>This DPA applies when ReFURRM Ai Studio processes personal data on behalf of a user.</p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Roles</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>You are the Data Controller.</li>
                <li>ReFURRM Ai Studio is the Data Processor.</li>
                <li>Supabase and Stripe act as Sub Processors.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Processing Purpose</h2>
              <p>We process data only to provide platform services including content generation, storage, billing, support, and account management.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Security</h2>
              <p>We maintain technical and organizational safeguards including encryption, access controls, and secure hosting.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Sub Processors</h2>
              <p>We may use trusted third parties including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Supabase (database)</li>
                <li>Stripe (payments)</li>
                <li>Email and analytics providers</li>
              </ul>
              <p className="mt-2">We ensure they meet required security standards.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Rights</h2>
              <p>We assist you in fulfilling data access, correction, deletion, and portability requests.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Breach</h2>
              <p>If a breach occurs, we will notify affected users as required by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
              <p>Upon account closure, data may be deleted or anonymized in accordance with retention policies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact</h2>
              <p>Email: support@refurrm.app | Phone: 479.446.6201</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
