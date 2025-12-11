import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardNav from '@/components/DashboardNav';
import AIProductGenerator from '@/components/AIProductGenerator';
import { ArrowLeft, Sparkles, Upload, Plus, X, Package, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProductForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasActiveSubscription, isVip } = useSubscription();
  const [productType, setProductType] = useState('digital');
  const [showAIModal, setShowAIModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: 'digital',
    visibility: 'public',
    modules: [],
    duration: '60',
    availableDays: [],
    maxBookingsPerDay: '3',
    isSubscription: false,
    billingInterval: 'month',
    // Physical product fields
    sku: '',
    inventory: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    requiresShipping: true,
    variants: []
  });



  const handleAIApply = (data: any) => {
    setFormData({
      ...formData,
      name: data.name,
      description: data.description,
      price: data.price.toString()
    });
    toast({
      title: "AI content applied!",
      description: "Review and customize as needed.",
    });
  };


  const handleAIGenerate = () => {
    // Simulate AI generation
    toast({
      title: "AI is generating content...",
      description: "This will take a few seconds.",
    });
    
    setTimeout(() => {
      setFormData({
        ...formData,
        name: 'Instagram Growth Masterclass',
        description: 'Learn proven strategies to grow your Instagram following from 0 to 10K in 90 days. This comprehensive guide includes content templates, hashtag strategies, and engagement tactics that actually work.',
        price: '197'
      });
      toast({
        title: "Content generated!",
        description: "Review and customize the AI suggestions.",
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Product created!",
      description: "Your product is now live in your store.",
    });
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-600 mt-2">Add a new product to your store</p>

        </div>

        {!hasActiveSubscription() && !isVip() && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>No Cost to Start!</strong> Create and save products now. Subscribe when you're ready to publish and start selling.
              <Button 
                onClick={() => navigate('/pricing')} 
                variant="link" 
                className="ml-2 p-0 h-auto text-blue-600 underline"
              >
                View Plans
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Product Type</CardTitle>
              <CardDescription>Choose what type of product you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={productType} onValueChange={setProductType}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="digital">Digital Product</TabsTrigger>
                  <TabsTrigger value="physical">Physical Product</TabsTrigger>
                  <TabsTrigger value="course">Course</TabsTrigger>
                  <TabsTrigger value="service">Service/Booking</TabsTrigger>
                </TabsList>
              </Tabs>

            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Set up your product details</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAIModal(true)}
                  className="flex items-center"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Generate
                </Button>

              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="E.g., Instagram Growth Guide"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what customers will get..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="97"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comparePrice">Compare at Price (optional)</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({...formData, comparePrice: e.target.value})}
                    placeholder="197"
                  />
                </div>
              </div>


              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <Label htmlFor="isSubscription" className="font-semibold">Recurring Subscription</Label>
                  <p className="text-sm text-gray-600">Charge customers on a recurring basis</p>
                </div>
                <Switch
                  id="isSubscription"
                  checked={formData.isSubscription}
                  onCheckedChange={(checked) => setFormData({...formData, isSubscription: checked})}
                />
              </div>

              {formData.isSubscription && (
                <div>
                  <Label htmlFor="billingInterval">Billing Interval</Label>
                  <Select value={formData.billingInterval} onValueChange={(value) => setFormData({...formData, billingInterval: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={formData.visibility} onValueChange={(value) => setFormData({...formData, visibility: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>


          {productType === 'digital' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>Upload files customers will receive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500">PDF, ZIP, MP3, MP4 up to 100MB</p>
                  <Button type="button" variant="outline" className="mt-4">
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {productType === 'course' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Course Structure</CardTitle>
                <CardDescription>Organize your course content</CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="outline" className="mb-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </Button>
                <p className="text-sm text-gray-600">
                  Start by adding modules, then add lessons to each module.
                </p>
              </CardContent>
            </Card>
          )}

          {productType === 'service' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Booking Settings</CardTitle>
                <CardDescription>Configure your availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="duration">Session Duration (minutes)</Label>
                  <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Available Days</Label>
                  <div className="grid grid-cols-7 gap-2 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <Button
                        key={day}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxBookings">Max Bookings Per Day</Label>
                  <Input
                    id="maxBookings"
                    type="number"
                    value={formData.maxBookingsPerDay}
                    onChange={(e) => setFormData({...formData, maxBookingsPerDay: e.target.value})}
                    placeholder="3"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {productType === 'physical' && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>Upload images of your physical product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drop images here or click to upload
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG up to 10MB each</p>
                    <Button type="button" variant="outline" className="mt-4">
                      Choose Images
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Inventory & SKU</CardTitle>
                  <CardDescription>Manage stock and product identification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        placeholder="PAINT-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inventory">Inventory Quantity</Label>
                      <Input
                        id="inventory"
                        type="number"
                        value={formData.inventory}
                        onChange={(e) => setFormData({...formData, inventory: e.target.value})}
                        placeholder="50"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Shipping Details</CardTitle>
                  <CardDescription>Set dimensions and weight for shipping calculations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
                    <div>
                      <Label htmlFor="requiresShipping" className="font-semibold">Requires Shipping</Label>
                      <p className="text-sm text-gray-600">This product needs to be shipped</p>
                    </div>
                    <Switch
                      id="requiresShipping"
                      checked={formData.requiresShipping}
                      onCheckedChange={(checked) => setFormData({...formData, requiresShipping: checked})}
                    />
                  </div>

                  {formData.requiresShipping && (
                    <>
                      <div>
                        <Label htmlFor="weight">Weight (lbs)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          value={formData.weight}
                          onChange={(e) => setFormData({...formData, weight: e.target.value})}
                          placeholder="2.5"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="length">Length (in)</Label>
                          <Input
                            id="length"
                            type="number"
                            step="0.1"
                            value={formData.length}
                            onChange={(e) => setFormData({...formData, length: e.target.value})}
                            placeholder="12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="width">Width (in)</Label>
                          <Input
                            id="width"
                            type="number"
                            step="0.1"
                            value={formData.width}
                            onChange={(e) => setFormData({...formData, width: e.target.value})}
                            placeholder="8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height">Height (in)</Label>
                          <Input
                            id="height"
                            type="number"
                            step="0.1"
                            value={formData.height}
                            onChange={(e) => setFormData({...formData, height: e.target.value})}
                            placeholder="4"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/products')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Create Product
            </Button>
          </div>
        </form>

        <AIProductGenerator 
          open={showAIModal} 
          onClose={() => setShowAIModal(false)}
          onApply={handleAIApply}
        />
      </main>
    </div>
  );
}