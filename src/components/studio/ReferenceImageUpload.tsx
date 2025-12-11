import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ReferenceImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ReferenceImageUpload({ onImagesChange, maxImages = 5 }: ReferenceImageUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ url: string; preview: string }[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    if (images.length + files.length > maxImages) {
      toast({ title: `Maximum ${maxImages} reference images allowed`, variant: "destructive" });
      return;
    }

    setUploading(true);
    const newImages: { url: string; preview: string }[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('reference-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('reference-images')
          .getPublicUrl(fileName);

        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({ url: publicUrl, preview: reader.result as string });
          if (newImages.length === files.length) {
            const updated = [...images, ...newImages];
            setImages(updated);
            onImagesChange(updated.map(img => img.url));
          }
        };
        reader.readAsDataURL(file);
      }

      toast({ title: "Reference images uploaded!" });
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated.map(img => img.url));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Label className="text-lg font-semibold">Reference Images</Label>
          <p className="text-sm text-gray-600">Upload images for AI to reference (style, colors, composition)</p>
        </div>
        <Badge variant="outline">{images.length}/{maxImages}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {images.map((img, i) => (
          <div key={i} className="relative group">
            <img src={img.preview} alt={`Reference ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(i)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {images.length < maxImages && (
        <>
          <input
            type="file"
            id="reference-upload"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleUpload}
          />
          <Button asChild variant="outline" className="w-full" disabled={uploading}>
            <label htmlFor="reference-upload" className="cursor-pointer">
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
              Add Reference Images
            </label>
          </Button>
        </>
      )}
    </Card>
  );
}
