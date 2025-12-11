import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AIProductGeneratorProps {
  open: boolean;
  onClose: () => void;
  onApply: (data: any) => void;
}

export default function AIProductGenerator({ open, onClose, onApply }: AIProductGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    idea: '',
    productType: 'digital',
    creatorNiche: '',
    priceRange: 'mid'
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
    if (!form.idea) {
      toast({ title: "Please describe your product idea", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-product-copy', {
        body: form
      });

      if (error) throw error;
      setResult(data);
      toast({ title: "AI generated your product copy!", description: "Review and customize as needed" });
    } catch (error) {
      toast({ title: "Generation failed", description: "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply({
        name: result.nameOptions[0],
        description: result.longDescription,
        price: result.suggestedPrice
      });
      onClose();
      setResult(null);
    }
  };

  const handleReset = () => {
    setResult(null);
    setForm({ idea: '', productType: 'digital', creatorNiche: '', priceRange: 'mid' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Product Copy Generator
          </DialogTitle>
          <DialogDescription>
            Describe your product idea and AI will generate compelling copy
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="idea">Product Idea</Label>
              <Textarea
                id="idea"
                value={form.idea}
                onChange={(e) => setForm({...form, idea: e.target.value})}
                placeholder="E.g., A course teaching Instagram growth strategies for coaches"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Product Type</Label>
                <Select value={form.productType} onValueChange={(v) => setForm({...form, productType: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital Product</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="template">Template/Tool</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="niche">Your Niche</Label>
                <Input
                  id="niche"
                  value={form.creatorNiche}
                  onChange={(e) => setForm({...form, creatorNiche: e.target.value})}
                  placeholder="E.g., Fitness coaching"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="price">Price Range</Label>
              <Select value={form.priceRange} onValueChange={(v) => setForm({...form, priceRange: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Budget ($0-$50)</SelectItem>
                  <SelectItem value="mid">Mid-range ($50-$200)</SelectItem>
                  <SelectItem value="high">Premium ($200+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Copy
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" /> Generate New
              </Button>
            </div>

            <div>
              <Label className="text-base font-semibold">Name Options</Label>
              <p className="text-xs text-gray-500 mb-2">Pick your favorite or mix and match</p>
              <div className="space-y-2">
                {result.nameOptions?.map((name: string, i: number) => (
                  <div key={i} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded border flex justify-between items-center hover:shadow-md transition-shadow">
                    <span className="font-medium">{name}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(name, `name-${i}`)}>
                      {copiedId === `name-${i}` ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">Description</Label>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(result.longDescription, 'desc')}>
                  {copiedId === 'desc' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="p-4 bg-gray-50 rounded border text-sm leading-relaxed">{result.longDescription}</p>
            </div>

            <div>
              <Label className="text-base font-semibold">Key Benefits</Label>
              <div className="mt-2 space-y-2">
                {result.benefits?.map((benefit: string, i: number) => (
                  <div key={i} className="flex items-start p-3 bg-green-50 rounded border-l-4 border-green-400">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
              <Label className="text-base font-semibold">Suggested Price</Label>
              <p className="text-3xl font-bold text-purple-600 mt-2">${result.suggestedPrice}</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApply} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Apply to Product
              </Button>
              <Button onClick={handleReset} variant="outline">
                Generate New
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}