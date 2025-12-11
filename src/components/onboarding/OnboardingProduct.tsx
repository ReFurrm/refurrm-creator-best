import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Package, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface OnboardingProductProps {
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingProduct = ({ onNext, onSkip }: OnboardingProductProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase.from('products').insert({
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: 'https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764042308285_1b3bb9ef.webp'
    });

    setLoading(false);
    if (error) {
      toast.error('Failed to create product');
    } else {
      toast.success('Product created!');
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <img src="https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764042308285_1b3bb9ef.webp" alt="Product" className="w-full h-48 object-cover rounded-xl" />
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6" />
          Create Your First Product
        </h3>
        <p className="text-muted-foreground">Add a product to start selling</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3">
        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900 dark:text-blue-100">
          Tip: You can always edit or add more products later from the Products page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Product Name</Label>
          <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>
        <div>
          <Label>Price ($)</Label>
          <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">Create Product</Button>
          <Button type="button" variant="outline" onClick={onSkip}>Skip</Button>
        </div>
      </form>
    </div>
  );
};
