import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAddOrder } from '@/hooks/useDatabase';
import { useCheckoutLeadAutoSave } from '@/hooks/useCheckoutLeads';
import { useFacebookTracking } from '@/hooks/useFacebookTracking';
import { useShippingMethods } from '@/hooks/useShippingMethods';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
  const { items, cartTotal, clearCart } = useCart();
  const addOrder = useAddOrder();
  const navigate = useNavigate();
  const { fbTrackInitiateCheckout, fbTrackPurchase } = useFacebookTracking();
  const { save: saveCheckoutLead, markCompleted: markLeadCompleted } = useCheckoutLeadAutoSave();
  const { data: shippingMethods = [] } = useShippingMethods(true);
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedShippingId, setSelectedShippingId] = useState('');

  const [form, setForm] = useState({
    fullName: '', phone: '', address: '', notes: '',
  });

  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingId) {
      setSelectedShippingId(shippingMethods[0].id);
    }
  }, [shippingMethods]);

  const selectedShipping = shippingMethods.find(s => s.id === selectedShippingId);
  const shippingCharge = selectedShipping ? Number(selectedShipping.charge) : 0;
  const total = cartTotal + shippingCharge;

  useEffect(() => {
    if (items.length > 0) {
      fbTrackInitiateCheckout({
        content_ids: items.map(i => i.product.id),
        value: cartTotal,
        num_items: items.reduce((s, i) => s + i.quantity, 0),
      });
    }
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    saveCheckoutLead({
      name: form.fullName, phone: form.phone, email: '',
      address: form.address,
      area: '', notes: form.notes,
      cartItems: items.map(item => ({
        productId: item.product.id, productName: item.product.name, color: item.color, size: item.size,
        quantity: item.quantity, price: item.product.price,
        customSpecs: item.customSpecs,
      })),
      cartTotal: total,
    });
  }, [form, items.length, selectedShippingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address) {
      toast.error(t('checkout.fill_required'));
      return;
    }

    setIsSubmitting(true);
    const orderItems = items.map(item => ({
      productId: item.product.id, productName: item.product.name, color: item.color, size: item.size,
      quantity: item.quantity, price: item.product.price,
      customSpecs: item.customSpecs,
    }));
    const shippingAddress = `${form.address}, Malaysia`;
    const orderNumber = `ORD${String(Date.now()).slice(-6)}`;

    try {
      await addOrder.mutateAsync({
        order_number: orderNumber, customer_name: form.fullName,
        customer_email: '', customer_phone: form.phone,
        items: orderItems, total, status: 'pending', payment_method: 'cod',
        shipping_address: shippingAddress,
        notes: `${form.notes}${selectedShipping ? `\nShipping: ${selectedShipping.name} (${shippingCharge === 0 ? 'Free' : shippingCharge + ' RM'})` : ''}`,
      });
      await markLeadCompleted();
      setOrderId(orderNumber);
      fbTrackPurchase({
        content_ids: items.map(i => i.product.id), value: total,
        num_items: items.reduce((s, i) => s + i.quantity, 0), order_id: orderNumber,
      });
      clearCart();
      setOrderPlaced(true);
      toast.success(t('checkout.order_success'));
    } catch (error) {
      toast.error(t('checkout.order_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderPlaced) { navigate('/cart'); return null; }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 text-center px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
          </motion.div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('checkout.order_confirmed')}</h1>
          <p className="font-body text-muted-foreground mb-2">{t('checkout.title')} <span className="font-bold text-primary">{orderId}</span> {t('checkout.order_placed')}</p>
          <p className="font-body text-muted-foreground mb-8">{t('checkout.payment_cod')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-body text-sm font-bold tracking-wider uppercase hover:bg-primary/90 transition-all rounded-md">
              {t('checkout.continue_shopping')}
            </Link>
            <Link to="/" className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-2 font-body text-sm font-bold tracking-wider uppercase hover:bg-muted transition-all rounded-md">
              {t('checkout.go_home')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 lg:pt-28">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <Link to="/cart" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> {t('checkout.back_to_cart')}
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-10 text-foreground">{t('checkout.title')}</h1>
          <form onSubmit={handleSubmit} className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-6 text-foreground">{t('checkout.contact_info')}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1 block">{t('checkout.full_name')} *</label>
                    <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Ahmad bin Ismail" required />
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1 block">{t('checkout.phone')} *</label>
                    <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+60 12-345 6789" required />
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1 block">{t('checkout.shipping_address')} *</label>
                    <Input name="address" value={form.address} onChange={handleChange} placeholder="Apartment, Street, City, State" required />
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1 block">{t('checkout.notes')}</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} placeholder={t('checkout.delivery_instructions')}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-6 text-foreground">{t('checkout.shipping_method')}</h2>
                <div className="space-y-3">
                  {shippingMethods.map(method => (
                    <label key={method.id}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedShippingId === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                        }`}>
                      <input type="radio" name="shipping" value={method.id} checked={selectedShippingId === method.id}
                        onChange={() => setSelectedShippingId(method.id)} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedShippingId === method.id ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                        {selectedShippingId === method.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-body text-sm font-bold text-foreground">{method.name}</p>
                          <span className="font-body text-sm font-bold text-primary">
                            {Number(method.charge) === 0 ? t('cart.free') : `${Number(method.charge).toFixed(2)} RM`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {method.area_zone && <span className="font-body text-xs text-muted-foreground">{method.area_zone}</span>}
                          {method.estimated_delivery && (
                            <>
                              <span className="text-muted-foreground">·</span>
                              <span className="font-body text-xs text-muted-foreground flex items-center gap-1"><Truck className="w-3 h-3" />{method.estimated_delivery}</span>
                            </>
                          )}
                        </div>
                        {method.description && <p className="font-body text-xs text-muted-foreground mt-1">{method.description}</p>}
                      </div>
                    </label>
                  ))}
                  {shippingMethods.length === 0 && (
                    <p className="font-body text-sm text-muted-foreground">{t('checkout.no_shipping')}</p>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 text-foreground">{t('checkout.payment_method')}</h2>
                <div className="flex items-center gap-3 p-4 border-2 border-primary rounded-lg bg-primary/5">
                  <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-bold text-foreground">{t('checkout.cod')}</p>
                    <p className="font-body text-xs text-muted-foreground">{t('checkout.cod_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-fit">
              <div className="bg-card border border-border rounded-lg p-5 lg:sticky lg:top-24">
                <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-6 text-foreground">{t('cart.order_summary')}</h2>
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-14 h-14 bg-muted rounded overflow-hidden shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-bold truncate text-foreground">{item.product.name}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          {item.size ? `Size: ${item.size} · ` : ''}
                          {item.color ? `Color: ${item.color} · ` : ''}
                          {item.customSpecs && Object.entries(item.customSpecs).map(([k, v]) => v ? `${k}: ${v} · ` : '').join('')}
                          x{item.quantity}
                        </p>
                        <p className="font-body text-xs font-bold text-primary">RM {(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 font-body text-sm border-t border-border pt-4 mb-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">{t('cart.subtotal')}</span><span>RM {cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.shipping')}{selectedShipping ? ` (${selectedShipping.name})` : ''}</span>
                    <span>{shippingCharge === 0 ? t('cart.free') : `RM ${shippingCharge.toFixed(2)}`}</span>
                  </div>
                </div>
                <div className="flex justify-between font-heading text-xl font-bold border-t border-border pt-4 mb-6 text-foreground">
                  <span>{t('cart.total')}</span><span className="text-primary">RM {total.toFixed(2)}</span>
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-4 font-body text-sm font-bold tracking-wider uppercase hover:bg-primary/90 transition-all duration-300 rounded-md disabled:opacity-50">
                  {isSubmitting ? t('checkout.placing') : t('checkout.place_order')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
