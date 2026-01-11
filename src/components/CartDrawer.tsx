import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</p>
            <p className="text-sm text-gray-500 mb-6">Add items to get started</p>
            <Button onClick={closeCart}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-250px)] pr-4 mt-6">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex gap-4">
                      <img
                        src={item.image_url || '/placeholder.svg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                        <p className="text-lg font-bold text-purple-600">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    {index < items.length - 1 && <Separator />}
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
              <div className="space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-purple-600">${totalPrice.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
                <Button onClick={clearCart} variant="outline" className="w-full">
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
