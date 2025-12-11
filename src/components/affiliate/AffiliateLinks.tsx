import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AffiliateLinks() {
  const { toast } = useToast();
  const affiliateCode = 'SARAH2024';
  const baseUrl = 'https://yourstore.com';

  const links = [
    { name: 'Homepage', url: `${baseUrl}?ref=${affiliateCode}`, clicks: 234 },
    { name: 'Product Page', url: `${baseUrl}/products?ref=${affiliateCode}`, clicks: 156 },
    { name: 'Storefront', url: `${baseUrl}/storefront?ref=${affiliateCode}`, clicks: 89 },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={affiliateCode} readOnly className="font-mono" />
            <Button onClick={() => copyToClipboard(affiliateCode)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.map((link) => (
            <div key={link.name} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <Label className="font-semibold">{link.name}</Label>
                <span className="text-sm text-muted-foreground">{link.clicks} clicks</span>
              </div>
              <div className="flex gap-2">
                <Input value={link.url} readOnly className="text-sm" />
                <Button size="sm" onClick={() => copyToClipboard(link.url)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open(link.url, '_blank')}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
