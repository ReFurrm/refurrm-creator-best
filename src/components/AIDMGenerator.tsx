import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Copy, Check, RefreshCw, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (data: any) => void;
}

export default function AIDMGenerator({ open, onClose, onApply }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    campaignName: '',
    goal: '',
    productName: '',
    keyword: ''
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    if (!form.campaignName || !form.keyword) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-dm-script-generator', {
        body: form
      });
      if (error) throw error;
      setResult(data);
      toast({ title: "DM campaign generated!", description: "Your automated sequence is ready" });
    } catch (error) {
      toast({ title: "Generation failed", description: "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setForm({ campaignName: '', goal: '', productName: '', keyword: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI DM Script Generator
          </DialogTitle>
          <DialogDescription>
            Create automated DM sequences for Instagram keyword campaigns
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="campaign">Campaign Name *</Label>
              <Input
                id="campaign"
                value={form.campaignName}
                onChange={(e) => setForm({...form, campaignName: e.target.value})}
                placeholder="E.g., Course Launch, Product Promo"
              />
            </div>
            <div>
              <Label htmlFor="keyword">Keyword Trigger *</Label>
              <Input
                id="keyword"
                value={form.keyword}
                onChange={(e) => setForm({...form, keyword: e.target.value.toUpperCase()})}
                placeholder="E.g., COURSE, GUIDE, FREE"
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">Users will DM this word to trigger the sequence</p>
            </div>
            <div>
              <Label htmlFor="goal">Campaign Goal</Label>
              <Textarea
                id="goal"
                value={form.goal}
                onChange={(e) => setForm({...form, goal: e.target.value})}
                placeholder="E.g., Get users to sign up for my course"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="product">Product/Service Name</Label>
              <Input
                id="product"
                value={form.productName}
                onChange={(e) => setForm({...form, productName: e.target.value})}
                placeholder="E.g., Instagram Growth Course"
              />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Script</>}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" /> Generate New
              </Button>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">Suggested Caption</Label>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(result.suggestedCaption, 'caption')}>
                  {copiedId === 'caption' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm leading-relaxed">{result.suggestedCaption}</p>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">DM Sequence</Label>
              <p className="text-xs text-gray-500 mb-3">Automated messages sent after keyword trigger</p>
              <div className="space-y-3">
                {result.dmSequence?.map((dm: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="p-4 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-600">Message {dm.order}</span>
                          <span className="text-xs text-gray-500">• Delay: {dm.delayMinutes} min</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(dm.message, `dm-${i}`)}>
                          {copiedId === `dm-${i}` ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-700">{dm.message}</p>
                    </div>
                    {i < result.dmSequence.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="h-6 w-0.5 bg-purple-300"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => { onApply(result); onClose(); }} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Use This Campaign
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}