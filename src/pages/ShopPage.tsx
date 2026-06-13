import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useActiveProducts } from '@/hooks/useDatabase';
import { useActiveCategories } from '@/hooks/useCategories';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: dbProducts = [], isLoading } = useActiveProducts();
  const { data: dbCategories = [] } = useActiveCategories();
  const { t } = useLanguage();
  const categoryFilter = searchParams.get('category') || '';
  const urlBrand = searchParams.get('brand') || '';
  const searchFilter = searchParams.get('search') || '';
  const [search, setSearch] = useState(searchFilter);
  const [brandFilter, setBrandFilter] = useState(urlBrand);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [showFilters, setShowFilters] = useState(false);

  // Sync brand filter with URL
  useEffect(() => {
    setBrandFilter(urlBrand);
  }, [urlBrand]);

  const products = useMemo(() => {
    return dbProducts.map(p => ({
      id: p.id, name: p.name, brand: p.brand, price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : undefined,
      category: p.category as any, image: p.image, images: p.images || [p.image], colors: p.colors || [],
      description: p.description || '',
      rating: Number(p.rating) || 4.5, reviews: p.reviews || 0,
      isTrending: p.is_trending || false, isNew: p.is_new || false,
    }));
  }, [dbProducts]);

  const brands = useMemo(() => {
    const brandSet = new Set(products.map(p => p.brand).filter(Boolean));
    return Array.from(brandSet).sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (categoryFilter && p.category?.toLowerCase().trim() !== categoryFilter.toLowerCase().trim()) return false;
      if (brandFilter && p.brand !== brandFilter) return false;
      
      const currentSearch = search || searchFilter;
      if (currentSearch && !p.name.toLowerCase().includes(currentSearch.toLowerCase()) && !(p.brand || '').toLowerCase().includes(currentSearch.toLowerCase())) return false;
      
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });
  }, [products, categoryFilter, brandFilter, search, searchFilter, priceRange]);

  const setCategory = (cat: string) => {
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  const activeCategoryName = dbCategories.find(c => c.slug === categoryFilter)?.name;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 lg:pt-36">
        <div className="bg-card border-b border-border py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-neon font-body text-sm font-bold tracking-[0.3em] uppercase">{t('shop.collection')}</span>
              <h1 className="heading-display text-4xl md:text-6xl font-bold mt-2 text-foreground">
                {activeCategoryName || (categoryFilter ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1) : t('shop.all_products'))}
              </h1>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-4 mb-8 md:hidden">
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-border bg-background font-body text-sm text-foreground hover:border-neon transition-colors w-full rounded-sm">
              <SlidersHorizontal className="w-4 h-4" /> {t('shop.filters')}
            </button>
          </div>

          <div className="flex gap-8">
            <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0`}>
              <div className="sticky top-36 space-y-8">
                <div>
                  <h3 className="font-heading font-bold uppercase tracking-wider text-sm mb-4 text-foreground">{t('shop.categories')}</h3>
                  <div className="space-y-2">
                    <button onClick={() => setCategory('')}
                      className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${!categoryFilter ? 'text-neon font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>
                      {t('shop.all_products')}
                    </button>
                    {dbCategories.map(cat => (
                      <button key={cat.id} onClick={() => setCategory(cat.slug)}
                        className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${categoryFilter === cat.slug ? 'text-neon font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>
                        {cat.image_url && <img src={cat.image_url} alt="" className="w-4 h-4 inline-block mr-2 rounded object-cover" />}
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold uppercase tracking-wider text-sm mb-4 text-foreground">{t('shop.brands')}</h3>
                  <div className="space-y-2">
                    <button onClick={() => setBrandFilter('')}
                      className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${!brandFilter ? 'text-neon font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>
                      {t('shop.all_brands')}
                    </button>
                    {brands.map(brand => (
                      <button key={brand} onClick={() => setBrandFilter(brand)}
                        className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${brandFilter === brand ? 'text-neon font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold uppercase tracking-wider text-sm mb-4 text-foreground">{t('shop.price')}</h3>
                  <div className="flex gap-3 items-center font-body text-sm">
                    <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-20 px-3 py-2 border border-border bg-background text-sm text-foreground focus:outline-none focus:border-neon rounded-sm" placeholder="Min" />
                    <span className="text-muted-foreground">–</span>
                    <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-20 px-3 py-2 border border-border bg-background text-sm text-foreground focus:outline-none focus:border-neon rounded-sm" placeholder="Max" />
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <p className="font-body text-sm text-muted-foreground mb-6">{filtered.length} {t('shop.products_found')}</p>
              {isLoading ? (
                <div className="text-center py-20">
                  <p className="font-body text-muted-foreground">{t('shop.loading')}</p>
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {filtered.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="font-heading text-2xl uppercase font-bold mb-2 text-foreground">{t('shop.no_results')}</p>
                  <p className="font-body text-sm text-muted-foreground">{t('shop.adjust_filters')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;
