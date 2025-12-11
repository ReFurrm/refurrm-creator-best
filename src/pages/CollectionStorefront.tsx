import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { ChevronRight } from 'lucide-react';

export default function CollectionStorefront() {
  const { slug } = useParams();
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollection();
  }, [slug]);

  const loadCollection = async () => {
    const { data: collectionData } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .single();

    if (collectionData) {
      setCollection(collectionData);

      const { data: collectionProducts } = await supabase
        .from('collection_products')
        .select('product_id')
        .eq('collection_id', collectionData.id);

      const productIds = collectionProducts?.map(cp => cp.product_id) || [];

      if (productIds.length > 0) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        setProducts(productsData || []);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!collection) {
    return <div className="min-h-screen flex items-center justify-center">Collection not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <Link to="/storefront" className="hover:text-purple-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900">{collection.name}</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{collection.name}</h1>
          <p className="text-lg text-slate-600">{collection.description}</p>
          <p className="text-sm text-slate-500 mt-2">{products.length} products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
