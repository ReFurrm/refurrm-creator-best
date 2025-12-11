import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Download, Loader2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Mockup {
  productType: string;
  productName: string;
  mockupUrl: string;
  variants: string[];
  colors: string[];
  price: number;
}

interface Props {
  mockups: Mockup[];
  onAddToStore: () => void;
}

export default function MockupPreview({ mockups, onAddToStore }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  const addAllToStore = async () => {
    if (!user) return;
    
    setAdding(true);
    try {
      for (const mockup of mockups) {
        // Create main product
        const { data: product, error: productError } = await supabase
          .from('products')
          .insert({
            user_id: user.id,
            name: `Custom ${mockup.productName}`,
            description: `Beautiful custom ${mockup.productName} featuring your unique artwork. Available in multiple sizes and colors.`,
            price: mockup.price,
            image_url: mockup.mockupUrl,
            category: 'merchandise',
            stock: 100,
            is_active: true
          })
          .select()
          .single();

        if (productError) throw productError;

        // Add variants metadata
        const variantInfo = {
          sizes: mockup.variants,
          colors: mockup.colors,
          product_id: product.id
        };

        toast({ 
          title: `${mockup.productName} added!`,
          description: `With ${mockup.variants.length} sizes and ${mockup.colors.length} colors`
        });
      }

      toast({ 
        title: "All products added to store!", 
        description: `${mockups.length} products ready to sell`,
        duration: 5000
      });
      onAddToStore();
    } catch (error) {
      console.error('Add to store error:', error);
      toast({ title: "Failed to add products", variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Generated Mockups</h2>
          <p className="text-gray-600 mt-1">{mockups.length} products ready</p>
        </div>
        <Button onClick={addAllToStore} disabled={adding} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
          {adding ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
          Add All to Store
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {mockups.map((mockup, idx) => (
          <Card key={idx} className="p-4 hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden">
              <img 
                src={mockup.mockupUrl} 
                alt={mockup.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg">{mockup.productName}</h3>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="secondary" className="text-base font-bold">
                ${mockup.price}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                {mockup.variants.length} variants
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-500">Sizes: {mockup.variants.join(', ')}</p>
              <p className="text-xs text-gray-500">Colors: {mockup.colors.join(', ')}</p>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
