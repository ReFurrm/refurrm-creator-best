import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Plus, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setProducts(data);
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Product deleted' });
      fetchProducts();
    }
  }

  async function handleBulkDelete() {
    const ids = Array.from(selected);
    const { error } = await supabase.from('products').delete().in('id', ids);
    if (!error) {
      toast({ title: `${ids.length} products deleted` });
      setSelected(new Set());
      fetchProducts();
    }
  }

  function exportToCSV() {
    const items = products.filter(p => selected.has(p.id));
    const csv = [
      ['ID', 'Name', 'Description', 'Price', 'Category', 'Stock'],
      ...items.map(p => [p.id, p.name, p.description, p.price, p.category, p.stock])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    toast({ title: 'CSV exported' });
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      stock: parseInt(formData.get('stock') as string),
      image_url: formData.get('image_url') as string,
    };

    if (editProduct) {
      await supabase.from('products').update(productData).eq('id', editProduct.id);
    } else {
      await supabase.from('products').insert([productData]);
    }

    toast({ title: editProduct ? 'Product updated' : 'Product created' });
    setIsDialogOpen(false);
    setEditProduct(null);
    fetchProducts();
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(p => p.id)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          {selected.size > 0 && (
            <>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete ({selected.size})
              </Button>
            </>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditProduct(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editProduct ? 'Edit' : 'Add'} Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input name="name" defaultValue={editProduct?.name} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea name="description" defaultValue={editProduct?.description} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input name="price" type="number" step="0.01" defaultValue={editProduct?.price} required />
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <Input name="stock" type="number" defaultValue={editProduct?.stock} required />
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Input name="category" defaultValue={editProduct?.category} required />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input name="image_url" defaultValue={editProduct?.image_url} />
                </div>
                <Button type="submit" className="w-full">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selected.size === filtered.length && filtered.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  checked={selected.has(product.id)}
                  onCheckedChange={() => toggleSelect(product.id)}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditProduct(product);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
