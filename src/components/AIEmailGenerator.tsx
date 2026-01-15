import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (data: any) => void;
}

export default function AIEmailGenerator({ open, onClose, onApply }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    goal: '',
    productName: '',
    tone: 'professional'
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
    if (!form.goal || !form.productName) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-email-generator', {
        body: form
      });
      if (error) throw error;
      setResult(data);
      toast({ title: "Email campaign generated!", description: "Review and use your content" });
    } catch (error) {
      toast({ title: "Generation failed", description: "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setForm({ goal: '', productName: '', tone: 'professional' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C24C1A]" />
            AI Email Generator
          </DialogTitle>
          <DialogDescription>
            Generate professional email campaigns with AI-powered copywriting
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal">Campaign Goal</Label>
              <Input
                id="goal"
                value={form.goal}
                onChange={(e) => setForm({...form, goal: e.target.value})}
                placeholder="E.g., Launch new course, Promote sale, Build engagement"
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
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select value={form.tone} onValueChange={(v) => setForm({...form, tone: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                  <SelectItem value="urgent">Urgent & Direct</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full bg-[#C24C1A] hover:bg-[#A63D14]">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Email</>}
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
              <Label className="text-base font-semibold">Subject Lines</Label>
              <p className="text-xs text-gray-500 mb-2">Choose the one that resonates best</p>
              <div className="space-y-2">
                {result.subjectLines?.map((s: string, i: number) => (
                  <div key={i} className="p-3 bg-[#EDDACE]/50 border border-[#C24C1A]/30 rounded flex items-center justify-between group hover:shadow-md transition-shadow">
                    <span className="text-sm font-medium text-[#5C4033]">{s}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(s, `subject-${i}`)}>
                      {copiedId === `subject-${i}` ? <Check className="h-4 w-4 text-[#1E8D70]" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">Email Body</Label>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(result.emailBody?.replace(/<[^>]*>/g, ''), 'body')}>
                  {copiedId === 'body' ? <Check className="h-4 w-4 text-[#1E8D70]" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="p-4 bg-white rounded border text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: result.emailBody }} />
            </div>

            <Button onClick={() => { onApply(result); onClose(); }} className="w-full bg-[#C24C1A] hover:bg-[#A63D14]">
              Use This Email
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}