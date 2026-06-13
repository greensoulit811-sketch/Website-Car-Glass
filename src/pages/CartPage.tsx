import { Link } from 'react-router-dom';
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-40 pb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-card border border-border rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/60" />
            </div>
            <h1 className="heading-display text-4xl md:text-5xl font-bold mb-4 text-foreground uppercase tracking-tight">
              {t('cart.empty')}
            </h1>
            <p className="font-body text-muted-foreground max-w-sm mx-auto mb-10 text-lg">
              {t('cart.empty_subtitle')}
            </p>
            <Link to="/shop" 
              className="inline-flex items-center gap-3 bg-neon text-accent-foreground px-10 py-4 font-body text-sm font-bold tracking-[0.2em] uppercase glow-neon hover:bg-neon-glow transition-all duration-300 rounded-sm">
              {t('hero.shop_now')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const shipping = cartTotal >= 30 ? 0 : 3;

  return (
    <div className="min-h-screen bg-background pt-32 lg:pt-36">
      <Navbar />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 lg:px-8 py-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="heading-display text-4xl md:text-5xl font-bold mb-10 text-foreground">{t('cart.title')}</motion.h1>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <motion.div key={item.product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex gap-4 sm:gap-6 border-b border-border pb-6">
                  <Link to={`/product/${item.product.id}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-card shrink-0 overflow-hidden rounded-lg border border-border">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-body text-xs text-neon font-bold tracking-wider uppercase">{item.product.brand}</span>
                        <Link to={`/product/${item.product.id}`} className="block font-heading font-bold text-sm sm:text-base uppercase tracking-wide text-foreground hover-neon transition-colors">{item.product.name}</Link>
                        {item.size && <p className="font-body text-xs text-muted-foreground mt-1">Size: {item.size}</p>}
                        {item.color && <p className="font-body text-xs text-muted-foreground mt-0.5">Color: {item.color}</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border rounded-sm">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-card transition-colors"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 h-8 flex items-center justify-center font-body text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-card transition-colors"><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="font-heading font-bold text-neon">RM {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-card p-8 border border-border rounded-lg h-fit">
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-6 text-foreground">{t('cart.order_summary')}</h2>
              <div className="space-y-3 font-body text-sm border-b border-border pb-6 mb-6">
                <div className="flex justify-between"><span className="text-muted-foreground">{t('cart.subtotal')}</span><span className="text-foreground">RM {cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t('cart.shipping')}</span><span className="text-foreground">{shipping === 0 ? t('cart.free') : `RM ${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between pt-4 border-t border-border mt-4 font-heading text-xl font-bold uppercase tracking-wider">
                  <span>{t('cart.total')}</span><span className="text-neon">RM {(cartTotal + shipping).toFixed(2)}</span>
                </div>
              </div>
              <Link to="/checkout" className="w-full block text-center bg-primary text-primary-foreground py-4 font-body text-sm font-bold tracking-wider uppercase hover:bg-primary/90 transition-all duration-300 rounded-md mb-3">
                {t('cart.checkout')}
              </Link>
              <p className="text-center font-body text-xs text-muted-foreground">{t('cart.cod_available')}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
