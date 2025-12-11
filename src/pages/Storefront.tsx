import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ProductFilters from '@/components/ProductFilters';
import ActiveFilters from '@/components/ActiveFilters';
import ProductCard from '@/components/ProductCard';
import { Layers } from 'lucide-react';

export default function Storefront() {
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(1000);


  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const { data } = await supabase
      .from('collections')
      .select('*, collection_products(count)')
      .limit(6);
    
    if (data) setCollections(data);
  };


  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setProducts(data);
      const max = Math.max(...data.map(p => p.price), 1000);
      setMaxPrice(max);
      setPriceRange([0, max]);
    }
  };

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    filtered = filtered.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name-az': return a.name.localeCompare(b.name);
        case 'newest': 
        default: 
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const clearAll = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, maxPrice]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Store</h1>
          <p className="text-gray-600">Discover amazing products</p>
        </div>

        {collections.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.map(collection => (
                <Link
                  key={collection.id}
                  to={`/collection/${collection.slug}`}
                  className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Layers className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-semibold">{collection.name}</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">{collection.description}</p>
                  <p className="text-xs text-slate-500">
                    {collection.collection_products?.[0]?.count || 0} products
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProductFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categories={categories}
              maxPrice={maxPrice}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <ActiveFilters
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              priceRange={priceRange}
              sortBy={sortBy}
              maxPrice={maxPrice}
              onClearSearch={() => setSearchQuery('')}
              onClearCategory={() => setSelectedCategory('all')}
              onClearPriceRange={() => setPriceRange([0, maxPrice])}
              onClearAll={clearAll}
            />

            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
