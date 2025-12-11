import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface LogoUploadProps {
  currentLogo?: string;
  onLogoUpdate: (url: string) => void;
}

export default function LogoUpload({ currentLogo, onLogoUpdate }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentLogo);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please upload an image file', variant: 'destructive' });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('store-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('store-logos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ store_logo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setPreview(publicUrl);
      onLogoUpdate(publicUrl);
      toast({ title: 'Logo uploaded successfully!' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_profiles')
        .update({ store_logo_url: null })
        .eq('id', user.id);

      setPreview(undefined);
      onLogoUpdate('');
      toast({ title: 'Logo removed' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <Label>Store Logo</Label>
      
      {preview ? (
        <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
          <img src={preview} alt="Store logo" className="w-full h-full object-contain" />
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={removeLogo}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">No logo uploaded</p>
          </div>
        </div>
      )}

      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="cursor-pointer"
        />
        <p className="text-xs text-gray-500 mt-1">
          Recommended: Square image, at least 200x200px
        </p>
      </div>
    </div>
  );
}
