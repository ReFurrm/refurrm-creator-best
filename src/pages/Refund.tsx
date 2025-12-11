import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Refund() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Effective Date: November 25, 2025</p>

          <div className="space-y-6 prose prose-sm max-w-none">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. General</h2>
              <p>ReFURRM Ai Studio subscriptions are billed on a recurring basis. Refunds are not guaranteed and are handled case by case.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Eligible Refund Considerations</h2>
              <p>We may issue refunds for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>double charges</li>
                <li>failed access to paid features</li>
                <li>accidental upgrades reported promptly</li>
                <li>billing errors caused by the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Non Refundable Situations</h2>
              <p>Refunds will not be provided for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>changes of mind</li>
                <li>unused time on a subscription</li>
                <li>user errors</li>
                <li>dissatisfaction with AI output</li>
                <li>violating the Terms of Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. How to Request</h2>
              <p>Submit refund requests through support. Include the email on your account and the charge in question.</p>
              <p className="mt-2">Contact: support@refurrm.app | Phone: 479.446.6201</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
