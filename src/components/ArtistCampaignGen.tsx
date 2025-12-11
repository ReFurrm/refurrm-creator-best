import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Loader2, Upload, X, Copy, Download, RefreshCw, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function ArtistCampaignGen() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [artworkType, setArtworkType] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const generateCampaign = async () => {
    if (!imagePreview && !description.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-campaign-generator', {
        body: { imageDescription: description, artworkType, imageData: imagePreview }
      });
      
      if (error) throw error;
      setCampaign(data);
      toast({ title: "Campaign generated successfully!" });

      if (user && data) {
        await supabase.from('artist_campaigns').insert({
          user_id: user.id, description, artwork_type: artworkType,
          image_url: imagePreview, analysis_colors: data.analysis?.colors || [],
          analysis_style: data.analysis?.style || '', analysis_mood: data.analysis?.mood || '',
          analysis_subject: data.analysis?.subject || '', product_title: data.productListing?.title || '',
          product_description: data.productListing?.description || '',
          product_price: data.productListing?.suggestedPrice || '',
          instagram_captions: data.socialMedia?.instagram || [],
          twitter_posts: data.socialMedia?.twitter || [],
          email_subject: data.email?.subject || '', email_body: data.email?.body || ''
        });
      }
    } catch (err) {
      toast({ title: "Generation failed", description: "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const exportCampaign = () => {
    const content = JSON.stringify(campaign, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
              <button onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">Upload your artwork image</p>
              <p className="text-xs text-gray-400 mt-1">AI will analyze colors, style, mood & subject</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
        </div>

        <input type="text" placeholder="Artwork type (e.g., watercolor, digital art, sketch)"
          value={artworkType} onChange={(e) => setArtworkType(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        <Textarea placeholder="Optional: Add description or context..." value={description}
          onChange={(e) => setDescription(e.target.value)} rows={3} />
        <Button onClick={generateCampaign} disabled={loading || (!imagePreview && !description.trim())} className="w-full">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing & Generating...</> : 'Generate Campaign'}
        </Button>
      </div>

      {campaign && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => { setCampaign(null); setDescription(''); setArtworkType(''); }} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> New Campaign
            </Button>
            <Button onClick={exportCampaign} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>

          {campaign.analysis && (
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="font-bold mb-3 flex items-center justify-between">
                AI Visual Analysis
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(JSON.stringify(campaign.analysis), 'analysis')}>
                  {copiedId === 'analysis' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="font-semibold text-blue-600">Colors:</span> {campaign.analysis.colors?.join(', ')}</div>
                <div><span className="font-semibold text-purple-600">Style:</span> {campaign.analysis.style}</div>
                <div><span className="font-semibold text-pink-600">Mood:</span> {campaign.analysis.mood}</div>
                <div><span className="font-semibold text-indigo-600">Subject:</span> {campaign.analysis.subject}</div>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="font-bold mb-3 flex items-center justify-between">
              Product Listing
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`${campaign.productListing?.title}\n\n${campaign.productListing?.description}`, 'product')}>
                {copiedId === 'product' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </h3>
            <p className="text-lg font-semibold text-gray-800">{campaign.productListing?.title}</p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{campaign.productListing?.description}</p>
            <p className="text-blue-600 font-bold mt-3 text-xl">{campaign.productListing?.suggestedPrice}</p>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-3">Social Media Pack</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-pink-600">Instagram Captions:</p>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(campaign.socialMedia?.instagram?.join('\n\n'), 'instagram')}>
                    {copiedId === 'instagram' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {campaign.socialMedia?.instagram?.map((cap: string, i: number) => (
                  <div key={i} className="p-3 bg-pink-50 rounded mt-2 text-sm border-l-4 border-pink-400">{cap}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-blue-600">Twitter Posts:</p>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(campaign.socialMedia?.twitter?.join('\n\n'), 'twitter')}>
                    {copiedId === 'twitter' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {campaign.socialMedia?.twitter?.map((tw: string, i: number) => (
                  <div key={i} className="p-3 bg-blue-50 rounded mt-2 text-sm border-l-4 border-blue-400">{tw}</div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-3 flex items-center justify-between">
              Email Blast
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`${campaign.email?.subject}\n\n${campaign.email?.body}`, 'email')}>
                {copiedId === 'email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </h3>
            <p className="text-sm font-semibold bg-gray-100 p-2 rounded">{campaign.email?.subject}</p>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed whitespace-pre-wrap">{campaign.email?.body}</p>
          </Card>
        </div>
      )}
    </div>
  );
}