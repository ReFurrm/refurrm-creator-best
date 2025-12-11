import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import MockupTemplateGrid from './MockupTemplateGrid';
import MockupPreview from './MockupPreview';
import ReferenceImageUpload from './ReferenceImageUpload';
import AIStyleAnalyzer from './AIStyleAnalyzer';


const PRODUCT_TYPES = [
  { id: 'tshirt', name: 'T-Shirt', price: 24.99 },
  { id: 'hoodie', name: 'Hoodie', price: 44.99 },
  { id: 'mug', name: 'Mug', price: 14.99 },
  { id: 'phonecase', name: 'Phone Case', price: 19.99 },
  { id: 'poster', name: 'Poster', price: 29.99 },
  { id: 'totebag', name: 'Tote Bag', price: 19.99 },
  { id: 'sticker', name: 'Sticker', price: 4.99 }
];

export default function StudioMockups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [artwork, setArtwork] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [removeBackground, setRemoveBackground] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mockups, setMockups] = useState<any[]>([]);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArtwork(file);
      const reader = new FileReader();
      reader.onloadend = () => setArtworkPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const generateMockups = async () => {
    if (!user || !artwork || selectedProducts.length === 0) {
      toast({ title: "Please upload artwork and select products", variant: "destructive" });
      return;
    }

    setGenerating(true);
    setProgress(0);
    setMockups([]);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const { data, error } = await supabase.functions.invoke('generate-product-mockups', {
        body: { artworkUrl: artworkPreview, productTypes: selectedProducts, removeBackground, referenceImages }
      });


      clearInterval(progressInterval);
      setProgress(100);

      if (error) throw error;

      setMockups(data.mockups || []);
      toast({ title: "Mockups generated!", description: `Created ${data.count} mockups` });
    } catch (error) {
      toast({ title: "Generation failed", variant: "destructive" });
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-start gap-4">
          <Wand2 className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold mb-2">AI Mockup Generator</h2>
            <p className="text-gray-600">Upload artwork and generate professional product mockups instantly.</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">1. Upload Artwork</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <input type="file" id="artwork-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
          <Button asChild variant="outline" className="w-full h-40 border-2 border-dashed">
            <label htmlFor="artwork-upload" className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 mb-3" />
              <span>Click to upload</span>
            </label>
          </Button>
          {artworkPreview && (
            <div className="border-2 rounded-lg p-4">
              <img src={artworkPreview} alt="Artwork" className="w-full h-32 object-contain" />
              <Badge className="mt-2">Ready</Badge>
            </div>
          )}
        </div>
      </Card>

      <ReferenceImageUpload onImagesChange={setReferenceImages} maxImages={5} />

      <AIStyleAnalyzer referenceImages={referenceImages} />


      <div>
        <h2 className="text-2xl font-bold mb-4">2. Select Products</h2>
        <MockupTemplateGrid products={PRODUCT_TYPES} selectedProducts={selectedProducts} onToggleProduct={toggleProduct} />
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">3. Generate</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox checked={removeBackground} onCheckedChange={(c) => setRemoveBackground(c as boolean)} />
            <Label>Remove background automatically</Label>
          </div>
          {generating && <Progress value={progress} />}
          <Button onClick={generateMockups} disabled={generating || !artwork || !selectedProducts.length} className="w-full" size="lg">
            {generating ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
            Generate {selectedProducts.length} Mockup{selectedProducts.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </Card>

      {mockups.length > 0 && <MockupPreview mockups={mockups} onAddToStore={() => {}} />}
    </div>
  );
}
