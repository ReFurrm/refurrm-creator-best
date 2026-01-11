import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CCPA() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EDDACE] p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-[#5C4033]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-[#5C4033]">CCPA Notice</h1>
          <p className="text-sm text-[#8B7355] mb-2">California Consumer Privacy Act</p>
          <p className="text-sm text-[#8B7355] mb-8">Applies to California residents</p>

          <div className="space-y-6 prose prose-sm max-w-none">
            <p className="text-[#5C4033]">This notice supplements the ReFURRM Ai Studio Privacy Policy.</p>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">1. Your Rights Under CCPA</h2>
              <p className="text-[#5C4033]">California users have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 text-[#5C4033]">
                <li>request the categories of personal data collected</li>
                <li>request deletion of personal data</li>
                <li>request the specific pieces of data collected</li>
                <li>request information on data sharing</li>
                <li>request to opt out of data selling (we do not sell data)</li>
                <li>not be discriminated against for exercising privacy rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">2. Categories of Data Collected</h2>
              <p className="text-[#5C4033]">We may collect:</p>
              <ul className="list-disc pl-6 space-y-1 text-[#5C4033]">
                <li>identifiers (name, email)</li>
                <li>commercial information (subscriptions, product activity)</li>
                <li>internet activity (usage logs)</li>
                <li>user generated content (uploads)</li>
                <li>technical data (device and browser info)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">3. Data Sharing</h2>
              <p className="text-[#5C4033]">We may share data with service providers such as:</p>
              <ul className="list-disc pl-6 space-y-1 text-[#5C4033]">
                <li>Supabase</li>
                <li>Stripe</li>
                <li>Email service providers</li>
                <li>Analytics platforms</li>
              </ul>
              <p className="mt-2 font-semibold text-[#C24C1A]">We do not sell personal data.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">4. Requests</h2>
              <p className="text-[#5C4033]">Users may submit a CCPA request through support. We may verify identity before fulfilling requests.</p>
              <p className="mt-2 text-[#5C4033]">Contact: support@refurrm.app | 479.446.6201</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
