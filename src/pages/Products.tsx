import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import DashboardNav from '@/components/DashboardNav';
import { 
  Plus, Package, GraduationCap, Calendar, 
  Edit, Trash2, Eye, Copy, MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Products() {
  const navigate = useNavigate();
  const [products] = useState([
    {
      id: 1,
      name: 'Content Strategy Guide',
      type: 'digital',
      price: 97,
      sales: 12,
      status: 'published',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Instagram Growth Course',
      type: 'course',
      price: 297,
      sales: 8,
      status: 'published',
      modules: 6,
      lessons: 24,
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: '1-on-1 Strategy Call',
      type: 'service',
      price: 197,
      bookings: 5,
      status: 'published',
      duration: '60 min',
      image: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Social Media Templates',
      type: 'digital',
      price: 47,
      sales: 28,
      status: 'draft',
      image: '/placeholder.svg'
    }
  ]);

  const ProductCard = ({ product }: any) => (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-100 relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <Badge 
          className="absolute top-2 right-2"
          variant={product.status === 'published' ? 'default' : 'secondary'}
        >
          {product.status}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-2xl font-bold text-[#C24C1A]">${product.price}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/products/${product.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open('/storefront', '_blank', 'noopener,noreferrer')}>
                <Eye className="mr-2 h-4 w-4" />
                View Live
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          {product.type === 'digital' && (
            <>
              <span className="flex items-center">
                <Package className="w-4 h-4 mr-1" />
                Digital Product
              </span>
              <span>{product.sales} sales</span>
            </>
          )}
          {product.type === 'course' && (
            <>
              <span className="flex items-center">
                <GraduationCap className="w-4 h-4 mr-1" />
                {product.modules} modules
              </span>
              <span>{product.sales} enrolled</span>
            </>
          )}
          {product.type === 'service' && (
            <>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {product.duration}
              </span>
              <span>{product.bookings} bookings</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const digitalProducts = products.filter(p => p.type === 'digital');
  const courses = products.filter(p => p.type === 'course');
  const services = products.filter(p => p.type === 'service');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">Manage your digital products, courses, and services</p>
          </div>
          <Link to="/products/new">
            <Button className="bg-[#C24C1A] hover:bg-[#A63D14]">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Products ({products.length})</TabsTrigger>
            <TabsTrigger value="digital">Digital ({digitalProducts.length})</TabsTrigger>
            <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
            <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="digital" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Start selling by creating your first product</p>
              <Link to="/products/new">
                <Button className="bg-[#C24C1A] hover:bg-[#A63D14]">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
