import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileImage, FileText, Mic, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function StudioUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [idea, setIdea] = useState('');
  const [productType, setProductType] = useState('digital');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }

    if (files.length === 0 && !idea.trim()) {
      toast({ title: "Upload a file or describe your idea", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-product-finisher', {
        body: { 
          idea: idea || 'Create a product from uploaded files',
          productType,
          fileCount: files.length
        }
      });

      if (error) throw error;

      toast({ 
        title: "Processing started!", 
        description: "AI is turning your upload into a finished product. Check the Processing tab." 
      });

      setFiles([]);
      setIdea('');
    } catch (error) {
      toast({ title: "Upload failed", description: "Please try again", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-8">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Drop anything here</h3>
          <p className="text-gray-600 mb-4">
            Art, sketches, notes, screenshots, PDFs, voice memos, rough drafts...
          </p>
          <p className="text-sm text-gray-500 mb-6">
            AI will clean it up, design it, write the copy, and make it ready to sell
          </p>
          
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept="image/*,application/pdf,.doc,.docx,.txt,.mp3,.mp4"
          />
          <Button asChild variant="outline" size="lg">
            <label htmlFor="file-upload" className="cursor-pointer">
              Choose Files
            </label>
          </Button>

          {files.length > 0 && (
            <div className="mt-4 text-left">
              <p className="font-semibold mb-2">{files.length} file(s) selected:</p>
              {files.map((file, i) => (
                <p key={i} className="text-sm text-gray-600">• {file.name}</p>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <Label className="text-lg font-semibold mb-3 block">Or describe your idea</Label>
        <Textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="E.g., 'I have a watercolor painting of a sunset I want to sell as prints' or 'I want to create a checklist for new plant parents'"
          className="min-h-[120px] mb-4"
        />
        
        <div className="flex gap-4 mb-4">
          <Button
            variant={productType === 'digital' ? 'default' : 'outline'}
            onClick={() => setProductType('digital')}
          >
            Digital Product
          </Button>
          <Button
            variant={productType === 'physical' ? 'default' : 'outline'}
            onClick={() => setProductType('physical')}
          >
            Physical Product
          </Button>
          <Button
            variant={productType === 'art' ? 'default' : 'outline'}
            onClick={() => setProductType('art')}
          >
            Art/Prints
          </Button>
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={uploading || (files.length === 0 && !idea.trim())}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Let AI Finish This
            </>
          )}
        </Button>
      </Card>
    </div>
  );
}
