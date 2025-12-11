import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download } from 'lucide-react';
import { generateCreatorRightsPDF, BusinessInfo } from '@/lib/pdfGenerator';
import { generateTermsPDF } from '@/lib/pdfTermsGenerator';
import { generatePrivacyPDF } from '@/lib/pdfPrivacyGenerator';

export default function LegalDocumentGenerator() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: '',
    creatorName: '',
    email: '',
    effectiveDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  });
  const [docType, setDocType] = useState('creator-rights');

  const handleGenerate = () => {
    if (!businessInfo.businessName || !businessInfo.creatorName) {
      alert('Please fill in business name and creator name');
      return;
    }

    switch (docType) {
      case 'creator-rights':
        generateCreatorRightsPDF(businessInfo);
        break;
      case 'terms':
        generateTermsPDF(businessInfo);
        break;
      case 'privacy':
        generatePrivacyPDF(businessInfo);
        break;
      default:
        alert('Please select a document type');
    }
  };


  return (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-purple-600" />
        <h2 className="text-2xl font-bold">Generate Custom Legal Documents</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={businessInfo.businessName}
            onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
            placeholder="Your Business Name"
          />
        </div>

        <div>
          <Label htmlFor="creatorName">Creator Name *</Label>
          <Input
            id="creatorName"
            value={businessInfo.creatorName}
            onChange={(e) => setBusinessInfo({ ...businessInfo, creatorName: e.target.value })}
            placeholder="Your Full Name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={businessInfo.email}
            onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label htmlFor="docType">Document Type</Label>
          <Select value={docType} onValueChange={setDocType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="creator-rights">Creator Rights & Ownership</SelectItem>
              <SelectItem value="terms">Terms of Service</SelectItem>
              <SelectItem value="privacy">Privacy Policy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleGenerate} size="lg" className="w-full">
        <Download className="mr-2 h-5 w-5" />
        Generate & Download PDF
      </Button>
    </Card>
  );
}
