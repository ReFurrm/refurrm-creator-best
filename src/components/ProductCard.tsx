import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        <img 
          src={product.image_url || '/placeholder.svg'} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.stock < 10 && product.stock > 0 && (
          <Badge className="absolute top-2 right-2 bg-orange-500">
            Only {product.stock} left
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            Out of Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2">{product.category}</Badge>
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-purple-600">${product.price.toFixed(2)}</p>
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
