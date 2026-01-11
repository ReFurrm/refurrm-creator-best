import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Shield, DollarSign, Lock, Eye, FileText } from 'lucide-react';
import LegalDocumentGenerator from '@/components/LegalDocumentGenerator';
import { useAuth } from '@/contexts/AuthContext';
import { generateCreatorRightsPDF } from '@/lib/pdfGenerator';

export default function CreatorRights() {
  const { user } = useAuth();

  const handleDownloadPDF = () => {
    generateCreatorRightsPDF({
      businessName: user?.user_metadata.name || 'Your Business',
      creatorName: user?.user_metadata.name || 'Creator',
      email: user?.email || '',
      effectiveDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Creator Rights & Ownership</h1>
          <p className="text-xl text-gray-600 mb-6">
            Your art. Your copyright. Your profits. Always.
          </p>
          <Button onClick={handleDownloadPDF} size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download Full Legal PDF
          </Button>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <Shield className="h-8 w-8 text-purple-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Copyright Ownership</h2>
                <p className="text-gray-700 mb-4">
                  <strong>You retain 100% ownership</strong> of all artwork, designs, and creative content you upload to ReFurrm.
                </p>
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">What this means:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>ReFurrm does not claim any ownership rights to your work</li>
                    <li>You can sell your art on other platforms simultaneously</li>
                    <li>You can remove your content at any time</li>
                    <li>All intellectual property rights remain with you</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="text-gray-700">
                    If you upload a digital illustration, you can also sell prints on Etsy, license it for commercial use, 
                    or publish it in a book—ReFurrm has no claim to your work beyond hosting it for your store.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <DollarSign className="h-8 w-8 text-green-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Profit Sharing: 100% to You</h2>
                <p className="text-gray-700 mb-4">
                  <strong>You keep 100% of your profits.</strong> ReFurrm charges transparent subscription fees—not commissions on your sales.
                </p>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Revenue breakdown:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Sale price set by you: 100% yours</li>
                    <li>Production costs (Printful/Printify): Paid directly by customer or deducted transparently</li>
                    <li>ReFurrm commission: $0 (zero)</li>
                    <li>Subscription fee: Fixed monthly rate (see Pricing)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="text-gray-700">
                    You sell a t-shirt for $30. Production cost is $12. You keep $18. ReFurrm takes $0 from that sale.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <Lock className="h-8 w-8 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Data Usage & Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Your artwork and data are used <strong>only to provide services you request.</strong>
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">How we use your content:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Display on your storefront and product listings</li>
                    <li>Generate mockups when you request them</li>
                    <li>Create marketing drafts when you opt in</li>
                    <li>Process orders and fulfill customer purchases</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">What we DON'T do:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Train AI models on your artwork without explicit consent</li>
                    <li>Sell or license your content to third parties</li>
                    <li>Use your art in ReFurrm marketing without permission</li>
                    <li>Share your designs with competitors or other creators</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <Eye className="h-8 w-8 text-purple-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">AI Assistance: Opt-In Controls</h2>
                <p className="text-gray-700 mb-4">
                  <strong>AI tools are optional and request-based.</strong> You control when and how AI assists you.
                </p>
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Default settings:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Manual approval required for all AI-generated content</li>
                    <li>AI tools activate only when you click "Generate" or similar</li>
                    <li>You can disable AI features entirely in Settings</li>
                    <li>Per-task control: use AI for mockups but not descriptions, etc.</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Your control options:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>Full Manual:</strong> Do everything yourself, no AI</li>
                    <li><strong>Draft Mode (default):</strong> AI creates drafts, you approve</li>
                    <li><strong>Assisted:</strong> AI suggests edits, you accept or reject</li>
                    <li>Change settings per project or globally in Settings → Automation</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <FileText className="h-8 w-8 text-indigo-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Content Licensing Terms</h2>
                <p className="text-gray-700 mb-4">
                  By uploading content, you grant ReFurrm a <strong>limited, non-exclusive license</strong> to display and process your work.
                </p>
                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">License scope:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>Purpose:</strong> Only to operate your store and fulfill orders</li>
                    <li><strong>Duration:</strong> Only while your content is active on ReFurrm</li>
                    <li><strong>Exclusivity:</strong> Non-exclusive (you can use your art elsewhere)</li>
                    <li><strong>Termination:</strong> License ends when you delete content or close account</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Plain English:</p>
                  <p className="text-gray-700">
                    We need permission to show your art on your storefront and send it to print partners. That's it. 
                    When you delete your art or leave ReFurrm, we stop using it immediately.
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-center">Our Commitment to Creators</h2>
            <div className="space-y-3 text-gray-700">
              <p>✓ <strong>We will never claim ownership</strong> of your artwork or designs</p>
              <p>✓ <strong>We will never take commissions</strong> from your sales</p>
              <p>✓ <strong>We will never use your art</strong> without your explicit permission</p>
              <p>✓ <strong>We will always give you control</strong> over automation and AI tools</p>
              <p>✓ <strong>We will always be transparent</strong> about fees, data usage, and policies</p>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Last updated: November 26, 2025 | Questions? <a href="/contact" className="text-purple-600 hover:underline">Contact us</a>
              </p>
              <Button onClick={handleDownloadPDF} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Complete Legal Document (PDF)
              </Button>
            </div>
          </Card>

          {/* Custom Legal Document Generator */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-6">Generate Personalized Legal Documents</h2>
            <p className="text-center text-gray-600 mb-8">
              Create custom legal documents with your business information
            </p>
            <LegalDocumentGenerator />
          </div>
        </div>
      </div>
    </div>
  );
}
