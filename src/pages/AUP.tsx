import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AUP() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EDDACE] p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-[#5C4033]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-[#5C4033]">Acceptable Use Policy</h1>
          <p className="text-sm text-[#8B7355] mb-8">Effective Date: November 25, 2025</p>

          <div className="space-y-6 prose prose-sm max-w-none">
            <p className="text-[#5C4033]">Users agree not to use ReFURRM Ai Studio to:</p>

            <section>
              <ul className="list-disc pl-6 space-y-2 text-[#5C4033]">
                <li>violate intellectual property rights</li>
                <li>upload illegal or harmful content</li>
                <li>generate deceptive, fraudulent, or misleading products</li>
                <li>upload malware or malicious code</li>
                <li>harass, abuse, or exploit others</li>
                <li>interfere with platform operations</li>
                <li>attempt unauthorized access</li>
                <li>engage in data scraping or extraction</li>
                <li>generate adult content involving minors</li>
                <li>violate privacy, confidentiality, or data laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">Consequences</h2>
              <p className="text-[#5C4033]">Violations may result in suspension or termination of your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">Reporting Violations</h2>
              <p className="text-[#5C4033]">If you encounter content or behavior that violates this policy, please report it immediately.</p>
              <p className="mt-2 text-[#5C4033]">Contact: support@refurrm.app | Phone: 479.446.6201</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
