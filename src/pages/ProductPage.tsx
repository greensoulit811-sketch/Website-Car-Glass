import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { Star, Heart, Minus, Plus, Truck, RefreshCw, Shield, Zap, MessageCircle } from 'lucide-react';
import { useActiveProducts } from '@/hooks/useDatabase';
import { useProductVariations } from '@/hooks/useProductVariations';
import { useCart } from '@/context/CartContext';
import { useFacebookTracking } from '@/hooks/useFacebookTracking';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductReviews from '@/components/ProductReviews';
import FakePurchaseNotification from '@/components/FakePurchaseNotification';
import CountdownTimer from '@/components/CountdownTimer';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const FeatureItem = ({ feature }: { feature: { image: string; title: string; description: string } }) => {
  const [isLarge, setIsLarge] = useState(false);
  const hasImage = !!feature.image;

  return (
    <div className={`group ${!hasImage || isLarge ? 'col-span-1 md:col-span-2 lg:col-span-3' : 'col-span-1'}`}>
      {hasImage && (
        <div className={`rounded-lg overflow-hidden border border-border bg-card mb-6 transition-colors group-hover:border-neon/50 ${isLarge ? 'w-full' : 'aspect-square w-full'}`}>
          <img 
            src={feature.image} 
            alt={feature.title} 
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              // If it's a landscape image or very large square, make it full width
              if (img.naturalWidth > img.naturalHeight * 1.2 || img.naturalWidth > 800) {
                setIsLarge(true);
              }
            }}
            className={`w-full transition-transform duration-500 group-hover:scale-105 ${isLarge ? 'h-auto object-contain' : 'h-full object-cover'}`} 
          />
        </div>
      )}
      <div className={!hasImage ? 'w-full py-12 px-6 text-center bg-secondary/10 rounded-xl border border-border/50 shadow-sm' : ''}>
        {feature.title && (
          <h3 className={`font-heading font-bold mb-3 text-foreground ${!hasImage ? 'text-2xl md:text-3xl  mb-6' : 'text-xl'}`}>
            {feature.title}
          </h3>
        )}
        {feature.description && (
          <p className={`font-body text-muted-foreground leading-relaxed whitespace-pre-wrap ${!hasImage ? 'text-base md:text-lg max-w-4xl mx-auto' : 'text-sm'}`}>
            {feature.description}
          </p>
        )}
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const { data: dbProducts = [], isLoading } = useActiveProducts();
  const { data: variations = [] } = useProductVariations(id || '');
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { fbTrackViewContent, fbTrackAddToCart } = useFacebookTracking();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [customSpecs, setCustomSpecs] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const allProducts = useMemo(() => dbProducts.map(p => ({
    id: p.id, name: p.name, brand: p.brand, price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    category: p.category as any, image: p.image,
    images: p.images || [p.image], colors: p.colors || [],
    description: p.description || '', rating: Number(p.rating) || 4.5,
    reviews: p.reviews || 0, isTrending: p.is_trending || false, isNew: p.is_new || false,
    specifications: (p as any).specifications as Record<string, string> || {},
    features: (p as any).features as { image: string, title: string, description: string }[] || [],
  })), [dbProducts]);

  const product = allProducts.find(p => p.id === id);

  const availableSizes = useMemo(() => {
    if (variations.length > 0) {
      return Array.from(new Set(variations.map(v => v.size).filter(Boolean)));
    }
    return [];
  }, [variations]);

  const availableColors = useMemo(() => {
    if (variations.length > 0) {
      if (selectedSize) {
        return Array.from(new Set(variations.filter(v => v.size === selectedSize).map(v => v.color).filter(Boolean)));
      }
      return [];
    }
    return product?.colors || [];
  }, [variations, product, selectedSize]);

  // Auto-select when only one option
  useEffect(() => {
    if (availableSizes.length === 1 && !selectedSize) setSelectedSize(availableSizes[0]);
    if (availableColors.length === 1 && !selectedColor) setSelectedColor(availableColors[0]);
  }, [availableColors, availableSizes, selectedColor, selectedSize]);

  // If selected color is not available in the new size, reset it
  useEffect(() => {
    if (selectedColor && availableColors.length > 0 && !availableColors.includes(selectedColor)) {
      setSelectedColor('');
    }
  }, [selectedSize, availableColors, selectedColor]);

  const selectedVariation = useMemo(() => {
    if (variations.length === 0) return null;
    
    const hasColors = availableColors.length > 0;
    const hasSizes = availableSizes.length > 0;

    if (hasColors && hasSizes) {
      if (selectedColor && selectedSize) {
        return variations.find(v => v.color === selectedColor && v.size === selectedSize) || null;
      }
      return null;
    }

    if (hasColors && selectedColor) {
      return variations.find(v => v.color === selectedColor) || null;
    }
    if (hasSizes && selectedSize) {
      return variations.find(v => v.size === selectedSize) || null;
    }
    
    return null;
  }, [selectedColor, selectedSize, variations, availableColors.length, availableSizes.length]);

  const displayPrice = selectedVariation?.price ? Number(selectedVariation.price) : product?.price || 0;
  const variationStock = selectedVariation ? selectedVariation.stock : null;

  useEffect(() => {
    if (product) {
      fbTrackViewContent({
        content_ids: [product.id], content_name: product.name,
        content_category: product.category, value: product.price,
      });
    }
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center"><p className="font-body text-muted-foreground">{t('loading')}</p></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="heading-display text-3xl font-bold mb-4 text-foreground">{t('product.not_found')}</h1>
          <Link to="/shop" className="text-neon font-body text-sm underline">{t('product.back_to_shop')}</Link>
        </div>
      </div>
    );
  }

  const galleryImages = product.images.length > 0 ? product.images : [product.image];
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const wishlisted = isInWishlist(product.id);
  const productNames = allProducts.map(p => p.name);

  const validateSelection = () => {
    if (availableColors.length > 0 && !selectedColor) { toast.error(t('product.select_color_error') || 'Please select a color'); return false; }
    if (availableSizes.length > 0 && !selectedSize) { toast.error('Please select a size'); return false; }
    if (variationStock !== null && variationStock <= 0) { toast.error(t('product.out_of_stock_error') || 'Out of stock'); return false; }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    const cartProduct = { ...product, price: displayPrice };
    addToCart(cartProduct, selectedSize || undefined, selectedColor, Object.keys(customSpecs).length > 0 ? customSpecs : undefined);
    fbTrackAddToCart({
      content_ids: [product.id], content_name: product.name,
      value: displayPrice * quantity, num_items: quantity,
    });
    toast.success(`${product.name} ${t('product.added_to_cart')}`);
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    const cartProduct = { ...product, price: displayPrice };
    addToCart(cartProduct, selectedSize || undefined, selectedColor, Object.keys(customSpecs).length > 0 ? customSpecs : undefined);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background pt-32 lg:pt-36">
      <Navbar />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center gap-2 font-body text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">{t('nav.home')}</Link><span>/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">{t('nav.shop')}</Link><span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Stretches to full height of right column */}
            <div className="relative">
              {/* Inner Sticky Container */}
              <div className="lg:sticky lg:top-36">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="relative aspect-square bg-card overflow-hidden rounded-lg border border-border mb-4 cursor-zoom-in"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setZoomPos({ x, y });
                    setIsZooming(true);
                  }}
                  onMouseLeave={() => setIsZooming(false)}
                >
                  <img 
                    src={galleryImages[selectedImage]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-200" 
                    style={{
                      transform: isZooming ? 'scale(2)' : 'scale(1)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                    }}
                  />
                </motion.div>
                {galleryImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {galleryImages.map((img, i) => (
                      <button key={i} onClick={() => setSelectedImage(i)}
                        className={`w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <span className="font-body text-sm text-neon font-bold tracking-wider uppercase">{product.brand}</span>
              <h1 className="heading-display text-3xl md:text-5xl font-bold mt-1 mb-4 text-foreground">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-neon text-neon' : 'text-border'}`} />
                  ))}
                </div>
                <span className="font-body text-sm text-muted-foreground">({product.reviews.toLocaleString()} {t('product.reviews')})</span>
              </div>

              <CountdownTimer />

              <div className="flex items-center gap-3 mb-8">
                <span className="font-heading text-4xl font-bold text-neon">RM {displayPrice}</span>
                {product.originalPrice && (
                  <>
                    <span className="font-body text-lg text-muted-foreground line-through">RM {product.originalPrice}</span>
                    <span className="bg-destructive text-destructive-foreground px-2 py-1 text-xs font-body font-bold tracking-wider uppercase rounded-sm">
                      {Math.round((1 - displayPrice / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {variationStock !== null && (
                <p className={`font-body text-sm mb-4 ${variationStock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                  {variationStock > 0 ? `${variationStock} ${t('product.in_stock')}` : t('product.out_of_stock')}
                </p>
              )}

              {/* Format Description */}
              {(() => {
                if (!product.description) return null;
                
                // Split by newline or bullet character
                const items = product.description
                  .split(/[\n•]/)
                  .map(item => item.trim())
                  .filter(Boolean);

                if (items.length > 0) {
                  return (
                    <ul className="list-disc list-outside ml-5 pl-2 space-y-2 font-body text-muted-foreground leading-relaxed mb-8 marker:text-muted-foreground">
                      {items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                return null;
              })()}



              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-heading font-bold uppercase tracking-wider text-sm mb-3 text-foreground">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border font-body text-sm font-medium rounded-sm transition-all ${selectedSize === size ? 'border-neon bg-neon text-accent-foreground' : 'border-border text-foreground hover:border-neon/50'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableColors.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-heading font-bold uppercase tracking-wider text-sm mb-3 text-foreground">{t('product.color')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(color => (
                      <button key={color} onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border font-body text-sm font-medium rounded-sm transition-all ${selectedColor === color ? 'border-neon bg-neon text-accent-foreground' : 'border-border text-foreground hover:border-neon/50'}`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DIY PC Configuration Section */}
              {product.category?.toLowerCase().includes('diy') && (
                <div className="mb-8 space-y-6 border-y border-border py-8">
                  <h3 className="font-heading font-bold uppercase tracking-wider text-lg text-neon">Configure Your DIY PC</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Processor', key: 'processor', options: ['Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'] },
                      { label: 'Motherboard', key: 'motherboard', options: ['B760M', 'Z790', 'B650M', 'X670E'] },
                      { label: 'RAM', key: 'ram', options: ['16GB DDR4', '32GB DDR4', '16GB DDR5', '32GB DDR5', '64GB DDR5'] },
                      { label: 'Graphics Card', key: 'gpu', options: ['RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'RX 7800 XT'] },
                      { label: 'Storage (SSD)', key: 'ssd', options: ['512GB NVMe', '1TB NVMe', '2TB NVMe'] },
                      { label: 'Power Supply', key: 'psu', options: ['650W 80+', '750W 80+', '850W 80+', '1000W 80+'] },
                    ].map((config) => (
                      <div key={config.key}>
                        <label className="font-body text-xs font-bold uppercase text-muted-foreground block mb-2">{config.label}</label>
                        <select 
                          className="w-full h-11 bg-background border border-border rounded-sm px-3 text-sm font-body text-foreground focus:outline-none focus:border-neon"
                          value={customSpecs[config.key] || ''}
                          onChange={(e) => setCustomSpecs(prev => ({ ...prev, [config.key]: e.target.value }))}
                        >
                          <option value="">Select {config.label}</option>
                          {config.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-border rounded-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-12 flex items-center justify-center hover:bg-card transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="w-12 h-12 flex items-center justify-center font-body text-sm font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-12 flex items-center justify-center hover:bg-card transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <button onClick={handleAddToCart}
                  disabled={variationStock !== null && variationStock <= 0}
                  className="flex-1 h-12 bg-neon text-accent-foreground font-body text-sm font-bold tracking-wider uppercase hover:bg-neon-glow transition-all duration-300 glow-neon rounded-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {variationStock !== null && variationStock <= 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
                </button>
                <button onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 border flex items-center justify-center rounded-sm transition-all ${wishlisted ? 'border-neon bg-neon/10' : 'border-border hover:border-neon/50'}`}>
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-neon text-neon' : 'text-foreground'}`} />
                </button>
              </div>

              <button onClick={handleBuyNow}
                disabled={variationStock !== null && variationStock <= 0}
                className="w-full h-12 bg-foreground text-background font-body text-sm font-bold tracking-wider uppercase hover:bg-foreground/90 transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed mb-3">
                {t('product.buy_now')}
              </button>

              <a
                href={`https://wa.me/+60193222058?text=${encodeURIComponent(`Hi! I'd like to order:\n\nProduct: ${product.name}\nBrand: ${product.brand}\nColor: ${selectedColor || 'Not selected'}\nSize: ${selectedSize || 'Not selected'}\nQuantity: ${quantity}\nPrice: RM ${displayPrice}\n\nPlease confirm my order. Thank you!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 bg-[#25D366] text-white font-body text-sm font-bold tracking-wider uppercase hover:bg-[#20bd5a] transition-all duration-300 rounded-sm flex items-center justify-center gap-2 mb-8"
              >
                <MessageCircle className="w-5 h-5" />
                Order on WhatsApp
              </a>

              <div className="space-y-3 border-t border-border pt-6">
                {[
                  { icon: Shield, text: t('product.authentic') },
                  { icon: Truck, text: t('product.free_delivery') },
                  { icon: RefreshCw, text: t('product.return_policy') },
                  { icon: Zap, text: t('product.cod') },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4 text-neon shrink-0" />{item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Product Description & Specifications Tabs */}
          <div className="mt-24 border-t border-border pt-10">
            <div className="flex justify-center gap-12 border-b border-border mb-12">
              <button 
                onClick={() => setActiveTab('description')}
                className={`pb-4 font-heading text-lg font-bold uppercase tracking-widest transition-all relative ${activeTab === 'description' ? 'text-neon' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Description
                {activeTab === 'description' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon" />}
              </button>
              <button 
                onClick={() => setActiveTab('specifications')}
                className={`pb-4 font-heading text-lg font-bold uppercase tracking-widest transition-all relative ${activeTab === 'specifications' ? 'text-neon' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Data Sheet
                {activeTab === 'specifications' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon" />}
              </button>
            </div>

            <div className="min-h-[200px]">
              {activeTab === 'description' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                  {product.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grid-flow-dense">
                      {product.features.map((feature, idx) => (
                        <FeatureItem key={idx} feature={feature} />
                      ))}
                    </div>
                  ) : (
                    <div className="max-w-4xl mx-auto">
                      {(() => {
                        if (!product.description) return null;
                        
                        // Split by newline or bullet character
                        const items = product.description
                          .split(/[\n•]/)
                          .map(item => item.trim())
                          .filter(Boolean);

                        if (items.length > 0) {
                          return (
                            <ul className="list-disc list-outside ml-5 pl-2 space-y-3 font-body text-muted-foreground leading-relaxed text-lg marker:text-muted-foreground text-left">
                              {items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          );
                        }

                        return <p className="font-body text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap text-center">{product.description}</p>;
                      })()}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
                  {Object.keys(product.specifications).length > 0 ? (
                    <div className="overflow-hidden border border-border rounded-sm">
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {Object.entries(product.specifications).map(([key, value], idx) => (
                            <tr key={idx} className={`${idx % 2 === 0 ? 'bg-secondary/40' : 'bg-white'} hover:bg-neon/5 transition-colors`}>
                              <td className="py-3 px-6 font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground w-1/3 md:w-1/4 border-r border-border/50">{key}</td>
                              <td className="py-3 px-6 font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="font-body text-muted-foreground italic text-center">No specifications available for this product.</p>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          <ProductReviews productId={product.id} />

          {related.length > 0 && (
            <section className="mt-20 pt-10 border-t border-border">
              <h2 className="heading-display text-2xl md:text-4xl font-bold mb-10 text-foreground">{t('product.related')}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      </div>
      <FakePurchaseNotification productNames={productNames} />
      <Footer />
    </div>
  );
};

export default ProductPage;
