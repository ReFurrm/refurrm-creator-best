import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AffiliateSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    youtube: '',
    promotional_methods: '',
    application_notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in first');

      const affiliateCode = `AFF${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      const { error } = await supabase.from('affiliates').insert({
        user_id: user.id,
        affiliate_code: affiliateCode,
        ...formData,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: 'Application Submitted!',
        description: 'We will review your application and get back to you soon.'
      });

      navigate('/affiliate-dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Join Our Affiliate Program</CardTitle>
            <CardDescription>
              Earn commissions by promoting our products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website/Blog</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <Input
                    id="instagram"
                    placeholder="@username"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter Handle</Label>
                  <Input
                    id="twitter"
                    placeholder="@username"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="tiktok">TikTok Handle</Label>
                  <Input
                    id="tiktok"
                    placeholder="@username"
                    value={formData.tiktok}
                    onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube Channel</Label>
                  <Input
                    id="youtube"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="methods">How will you promote our products? *</Label>
                <Textarea
                  id="methods"
                  required
                  rows={3}
                  value={formData.promotional_methods}
                  onChange={(e) => setFormData({ ...formData, promotional_methods: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Information</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={formData.application_notes}
                  onChange={(e) => setFormData({ ...formData, application_notes: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}