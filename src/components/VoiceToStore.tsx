import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Loader2, Copy, Download, RefreshCw, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function VoiceToStore() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateStore = async () => {
    if (!idea.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-voice-to-store', {
        body: { ideaDescription: idea }
      });
      
      if (error) throw error;
      setStore(data);
      toast({ title: "Store generated successfully!", description: "Your complete store is ready!" });

      if (user && data) {
        await supabase.from('generated_stores').insert({
          user_id: user.id, idea_description: idea,
          landing_headline: data.landingPage?.headline || '',
          landing_subheadline: data.landingPage?.subheadline || '',
          landing_hero_text: data.landingPage?.heroText || '',
          landing_features: data.landingPage?.features || [],
          lead_magnet_title: data.leadMagnet?.title || '',
          lead_magnet_content: data.leadMagnet?.content || '',
          sales_pain_points: data.salesCopy?.painPoints || [],
          sales_benefits: data.salesCopy?.benefits || [],
          sales_cta: data.salesCopy?.cta || '',
          sales_price: data.salesCopy?.price || ''
        });
      }
    } catch (err) {
      toast({ title: "Generation failed", description: "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const exportStore = () => {
    const content = JSON.stringify(store, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `store-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Describe your business idea... (e.g., 'I want to sell a checklist for people flipping furniture on weekends')"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={5}
            className="resize-none"
          />
          <Sparkles className="absolute top-3 right-3 h-5 w-5 text-purple-400" />
        </div>
        <Button onClick={generateStore} disabled={loading || !idea.trim()} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Building Store...</> : 'Build My Store'}
        </Button>
      </div>

      {store && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => { setStore(null); setIdea(''); }} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> New Store
            </Button>
            <Button onClick={exportStore} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>

          <Card className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl">Landing Page</h3>
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`${store.landingPage?.headline}\n${store.landingPage?.subheadline}\n\n${store.landingPage?.heroText}`, 'landing')}>
                {copiedId === 'landing' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{store.landingPage?.headline}</h2>
            <p className="text-lg text-gray-700 mt-3 font-medium">{store.landingPage?.subheadline}</p>
            <p className="text-gray-600 mt-4 leading-relaxed">{store.landingPage?.heroText}</p>
            <div className="mt-6 grid gap-3">
              {store.landingPage?.features?.map((feat: string, i: number) => (
                <div key={i} className="flex items-start bg-white/60 p-3 rounded-lg">
                  <span className="text-green-600 mr-3 font-bold text-lg">✓</span>
                  <span className="text-gray-700">{feat}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">Lead Magnet</h3>
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`${store.leadMagnet?.title}\n\n${store.leadMagnet?.content}`, 'magnet')}>
                {copiedId === 'magnet' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="font-semibold text-xl text-purple-600">{store.leadMagnet?.title}</p>
            <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded">{store.leadMagnet?.content}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">Sales Copy</h3>
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`Pain Points:\n${store.salesCopy?.painPoints?.join('\n')}\n\nBenefits:\n${store.salesCopy?.benefits?.join('\n')}`, 'sales')}>
                {copiedId === 'sales' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-red-600 mb-2">Pain Points:</p>
                <div className="space-y-2">
                  {store.salesCopy?.painPoints?.map((p: string, i: number) => (
                    <div key={i} className="flex items-start bg-red-50 p-3 rounded border-l-4 border-red-400">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-sm text-gray-700">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-600 mb-2">Benefits:</p>
                <div className="space-y-2">
                  {store.salesCopy?.benefits?.map((b: string, i: number) => (
                    <div key={i} className="flex items-start bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-sm text-gray-700">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-6">
                  {store.salesCopy?.cta}
                </Button>
                <p className="text-center mt-3 font-bold text-2xl text-blue-600">{store.salesCopy?.price}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}