import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface AIStyleAnalyzerProps {
  referenceImages: string[];
}

export default function AIStyleAnalyzer({ referenceImages }: AIStyleAnalyzerProps) {
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const analyzeStyle = async () => {
    if (referenceImages.length === 0) {
      toast({ title: "No reference images", description: "Upload images first", variant: "destructive" });
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-image-analyzer', {
        body: { imageUrls: referenceImages, analysisType: 'style' }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      setShowAnalysis(true);
      toast({ title: "Style analyzed!", description: "AI has analyzed your reference images" });
    } catch (error) {
      toast({ title: "Analysis failed", variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  if (referenceImages.length === 0) return null;

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold">AI Style Analysis</h3>
            <p className="text-sm text-gray-600">Let AI analyze your reference images</p>
          </div>
        </div>
        <Badge>{referenceImages.length} images</Badge>
      </div>

      <Button 
        onClick={analyzeStyle} 
        disabled={analyzing}
        variant="outline"
        className="w-full mb-4"
      >
        {analyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze Style & Colors
          </>
        )}
      </Button>

      {showAnalysis && analysis && (
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold mb-2">Style Analysis:</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysis}</p>
        </div>
      )}
    </Card>
  );
}
