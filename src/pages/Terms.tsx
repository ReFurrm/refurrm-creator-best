import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EDDACE] p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-[#5C4033]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-[#5C4033]">Terms of Service</h1>
          <p className="text-sm text-[#8B7355] mb-8">Effective Date: November 25, 2025</p>

          <div className="space-y-6 prose prose-sm max-w-none">
            <p className="text-[#5C4033]">Welcome to ReFURRM Ai Studio. By accessing or using this platform, you agree to the following Terms of Service. If you do not agree, do not use the platform.</p>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">1. Overview</h2>
              <p className="text-[#5C4033]">ReFURRM Ai Studio is an AI assisted creation and publishing platform. Users upload files, ideas, artwork, or voice notes. The system generates digital products, mockups, marketing assets, and related content.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">2. Eligibility</h2>
              <p className="text-[#5C4033]">You must be at least 18 years old to use this platform. Minors require direct supervision from a legal guardian.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">3. Account Responsibilities</h2>
              <p className="text-[#5C4033]">You agree to:</p>
              <ul className="list-disc pl-6 space-y-1 text-[#5C4033]">
                <li>provide accurate information</li>
                <li>maintain confidentiality of your login</li>
                <li>accept full responsibility for account activity</li>
              </ul>
              <p className="mt-2 text-[#5C4033]">We may suspend or close accounts that violate these Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">4. User Content</h2>
              <p className="text-[#5C4033]">You retain full ownership of the content you upload. By uploading, you grant ReFURRM Ai Studio a license to process, transform, and deliver your content through AI systems for the purpose of building your products.</p>
              <p className="mt-2 text-[#5C4033]">You agree that your content will not:</p>
              <ul className="list-disc pl-6 space-y-1 text-[#5C4033]">
                <li>infringe on intellectual property rights</li>
                <li>contain illegal material</li>
                <li>promote violence or harassment</li>
                <li>include personal data you are not authorized to share</li>
                <li>violate privacy laws</li>
              </ul>
              <p className="mt-2 text-[#5C4033]">We do not claim ownership of your finished assets.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">5. AI Generated Content</h2>
              <p className="text-[#5C4033]">AI output is generated automatically based on your uploads and inputs. You are responsible for reviewing accuracy, legality, and suitability before publishing or selling any generated content.</p>
              <p className="mt-2 text-[#5C4033]">ReFURRM Ai Studio does not guarantee accuracy, originality, or legal compliance of generated output.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">6. Prohibited Use</h2>
              <p className="text-[#5C4033]">You may not:</p>
              <ul className="list-disc pl-6 space-y-1 text-[#5C4033]">
                <li>misuse or reverse engineer the platform</li>
                <li>attempt to gain unauthorized access</li>
                <li>upload malicious code</li>
                <li>exploit the platform for fraudulent or harmful activity</li>
                <li>use the platform to violate intellectual property laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">7. Payments and Subscriptions</h2>
              <p className="text-[#5C4033]">Paid features may include monthly or annual subscriptions. By subscribing, you authorize recurring charges until you cancel.</p>
              <p className="mt-2 text-[#5C4033]">Refunds are not guaranteed. Refund decisions are made case by case.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">8. Termination</h2>
              <p className="text-[#5C4033]">We may suspend or terminate accounts that abuse, violate, or harm the platform or other users. You may close your account at any time.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">9. Data and Storage</h2>
              <p className="text-[#5C4033]">All data is stored in Supabase. You acknowledge that no digital system is perfectly secure and you accept normal operational risks associated with online services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">10. Disclaimer of Warranties</h2>
              <p className="text-[#5C4033]">The platform is provided as is and as available. We make no guarantees regarding uptime, speed, accuracy, or uninterrupted service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">11. Limitation of Liability</h2>
              <p className="text-[#5C4033]">ReFURRM Ai Studio is not liable for:</p>
              <ul className="list-disc pl-6 space-y-1 text-[#5C4033]">
                <li>lost profits</li>
                <li>lost data</li>
                <li>damages from misuse</li>
                <li>incorrect or harmful AI output</li>
                <li>platform errors or outages</li>
              </ul>
              <p className="mt-2 text-[#5C4033]">Your sole remedy is to stop using the platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#5C4033]">12. Changes to Terms</h2>
              <p className="text-[#5C4033]">We may update these Terms as the platform evolves. Significant changes will be posted on this page with a new effective date.</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
