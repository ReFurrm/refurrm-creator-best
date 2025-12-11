import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Effective Date: November 25, 2025</p>

          <div className="space-y-6 prose prose-sm max-w-none">
            <p>This Privacy Policy explains how ReFURRM Ai Studio collects, uses, stores, and protects your data.</p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Account information (name, email, password)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Content you upload (files, images, voice notes, text)</li>
                <li>Store and product information</li>
                <li>Customer and order data</li>
              </ul>
              <p className="mt-3">We also collect usage data automatically:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and features used</li>
                <li>Performance and error logs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide and improve our AI-powered services</li>
                <li>Process your uploads and generate digital products</li>
                <li>Manage your account and subscriptions</li>
                <li>Process payments and fulfill orders</li>
                <li>Send transactional emails and notifications</li>
                <li>Analyze platform usage and performance</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Storage and Security</h2>
              <p>Your data is stored securely using Supabase infrastructure with industry-standard encryption. We implement:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure authentication systems</li>
                <li>Regular security audits</li>
                <li>Access controls and monitoring</li>
              </ul>
              <p className="mt-2">However, no system is 100% secure. You acknowledge the inherent risks of online data storage.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. AI Processing</h2>
              <p>Content you upload may be processed by third-party AI services to generate products, copy, and marketing materials. We use:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>OpenAI API for text and image generation</li>
                <li>Other AI services as needed for platform features</li>
              </ul>
              <p className="mt-2">These services process your content according to their own privacy policies. We do not share your personal information with AI providers beyond what's necessary for processing.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Sharing</h2>
              <p>We do not sell your personal information. We may share data with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Payment processors (Stripe) for transactions</li>
                <li>Email service providers (SendGrid) for communications</li>
                <li>AI service providers for content generation</li>
                <li>Analytics tools to improve our service</li>
                <li>Law enforcement when legally required</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
              <p className="mt-2">Contact us to exercise these rights.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Maintain your login session</li>
                <li>Remember your preferences</li>
                <li>Analyze platform usage</li>
                <li>Track affiliate referrals</li>
              </ul>
              <p className="mt-2">You can control cookies through your browser settings.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Data Retention</h2>
              <p>We retain your data for as long as your account is active or as needed to provide services. After account deletion, we may retain certain data for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Legal compliance</li>
                <li>Fraud prevention</li>
                <li>Dispute resolution</li>
                <li>Backup and recovery purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p>Our platform is not intended for users under 18. We do not knowingly collect information from children. If we discover we have collected data from a child, we will delete it promptly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. International Users</h2>
              <p>Your data may be transferred to and processed in countries other than your own. By using our platform, you consent to such transfers.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to This Policy</h2>
              <p>We may update this Privacy Policy periodically. Significant changes will be posted on this page with a new effective date. Continued use of the platform after changes constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
              <p>For privacy-related questions or to exercise your rights:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email: support@refurrm.app</li>
                <li>Phone: 479.446.6201</li>
              </ul>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
