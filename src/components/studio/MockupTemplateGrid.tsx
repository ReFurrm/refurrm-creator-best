import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Props {
  products: Product[];
  selectedProducts: string[];
  onToggleProduct: (id: string) => void;
}

export default function MockupTemplateGrid({ products, selectedProducts, onToggleProduct }: Props) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Select Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => {
          const isSelected = selectedProducts.includes(product.id);
          return (
            <Card
              key={product.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : ''
              }`}
              onClick={() => onToggleProduct(product.id)}
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative">
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                <span className="text-4xl">{getProductEmoji(product.id)}</span>
              </div>
              <h3 className="font-semibold text-center">{product.name}</h3>
              <Badge variant="secondary" className="w-full justify-center mt-2">
                ${product.price}
              </Badge>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

function getProductEmoji(id: string) {
  const emojis: Record<string, string> = {
    tshirt: '👕',
    hoodie: '🧥',
    mug: '☕',
    phonecase: '📱',
    poster: '🖼️',
    totebag: '👜',
    sticker: '🏷️'
  };
  return emojis[id] || '📦';
}
