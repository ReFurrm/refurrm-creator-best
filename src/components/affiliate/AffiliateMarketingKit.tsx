import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download, Copy, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AffiliateMarketingKit() {
  const { toast } = useToast();

  const emailTemplate = `Hi [Name],

I wanted to share an amazing platform I've been using called [Brand Name]. 

It's perfect for [benefit]. I've been using it for [time] and it's helped me [result].

Check it out here: [Your Affiliate Link]

Let me know what you think!`;

  const socialPost = `Just discovered @BrandName - the easiest way to [benefit]! 

If you're a creator/entrepreneur, you need to check this out.

[Your Affiliate Link] 🚀`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Template copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={emailTemplate} readOnly rows={8} />
          <Button onClick={() => copyToClipboard(emailTemplate)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Template
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={socialPost} readOnly rows={6} />
          <Button onClick={() => copyToClipboard(socialPost)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Post
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marketing Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <ImageIcon className="w-4 h-4 mr-2" />
            Download Banner Images (1200x628)
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <ImageIcon className="w-4 h-4 mr-2" />
            Download Social Graphics (1080x1080)
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Download Brand Kit (ZIP)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
