import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentMethodCard() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const paymentMethod = {
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025
  };

  const handleUpdatePayment = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Payment method updated",
        description: "Your payment information has been updated successfully."
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-gray-400" />
            <div>
              <p className="font-medium">{paymentMethod.brand} ending in {paymentMethod.last4}</p>
              <p className="text-sm text-gray-500">
                Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleUpdatePayment}
            disabled={loading}
          >
            Update Card
          </Button>
          <Button 
            variant="outline"
            onClick={handleUpdatePayment}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
