import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Save, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface Collection {
  id: string;
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  theme: string;
  is_published: boolean;
}

export function CollectionEditor() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [collectionProducts, setCollectionProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCollections();
    loadProducts();
  }, []);

  const loadCollections = async () => {
    const { data } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
    if (data) setCollections(data);
  };

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  const generateAICollections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-collection-organizer', {
        body: { products }
      });
      if (error) throw error;
      toast.success('AI collections generated!');
      loadCollections();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveCollection = async () => {
    if (!selectedCollection) return;
    const { error } = await supabase.from('collections').upsert(selectedCollection);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Collection saved!');
      loadCollections();
    }
  };

  const deleteCollection = async (id: string) => {
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Collection deleted!');
      loadCollections();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Collection Manager</h2>
        <Button onClick={generateAICollections} disabled={loading}>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate AI Collections
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          {collections.map((col) => (
            <Card key={col.id} className="p-4 cursor-pointer hover:border-primary" onClick={() => setSelectedCollection(col)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{col.name}</h3>
                  <p className="text-sm text-muted-foreground">{col.theme}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteCollection(col.id); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {selectedCollection && (
          <div className="md:col-span-2 space-y-4">
            <Card className="p-6">
              <Input value={selectedCollection.name} onChange={(e) => setSelectedCollection({ ...selectedCollection, name: e.target.value })} placeholder="Collection Name" className="mb-4" />
              <Textarea value={selectedCollection.description} onChange={(e) => setSelectedCollection({ ...selectedCollection, description: e.target.value })} placeholder="Description" className="mb-4" />
              <Input value={selectedCollection.seo_title} onChange={(e) => setSelectedCollection({ ...selectedCollection, seo_title: e.target.value })} placeholder="SEO Title" className="mb-4" />
              <Textarea value={selectedCollection.seo_description} onChange={(e) => setSelectedCollection({ ...selectedCollection, seo_description: e.target.value })} placeholder="SEO Description" className="mb-4" />
              <Button onClick={saveCollection}>
                <Save className="w-4 h-4 mr-2" />
                Save Collection
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
