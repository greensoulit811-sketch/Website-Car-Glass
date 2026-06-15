import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Truck, RefreshCw, Shield, ChevronRight, ChevronLeft, Users, ShieldCheck, Phone, Star, Wand2, HeartHandshake, MapPin, Navigation, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { useActiveProducts, useActiveBanners, usePageContent, useSettings } from '@/hooks/useDatabase';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useActiveCategories } from '@/hooks/useCategories';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { useState, useEffect, useCallback, useMemo } from 'react';

// Using a generic laptop/tech placeholder for categories without images
const techPlaceholder = "/placeholder.svg";

const Index = () => {
  const { data: dbProducts = [] } = useActiveProducts();
  const { data: dbCategories = [] } = useActiveCategories();
  const { data: banners = [] } = useActiveBanners();
  const { data: whyChooseUsPage } = usePageContent('why-choose-us');
  const { data: testimonialPage } = usePageContent('testimonial-section');
  const { data: settings } = useSettings();
  const { t } = useLanguage();
  const [currentBanner, setCurrentBanner] = useState(0);

  const [contactForm, setContactForm] = useState({ number: '', email: '', address: '', message: '' });
  const [submittingContact, setSubmittingContact] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.number || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmittingContact(true);
    try {
      const { error } = await supabase.from('checkout_leads').insert({
        customer_phone: contactForm.number,
        customer_email: contactForm.email,
        shipping_address: contactForm.address,
        notes: contactForm.message,
        status: 'contact_form',
        session_id: 'contact_' + Date.now()
      });
      if (error) throw error;
      toast.success('Message sent successfully!');
      setContactForm({ number: '', email: '', address: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    } finally {
      setSubmittingContact(false);
    }
  };

  const whyData = whyChooseUsPage?.content ? JSON.parse(whyChooseUsPage.content) : {
    emergencyPhone: "+60103660467",
    stat1Value: "250+", stat1Label: "Project Complete",
    stat2Value: "1.5K", stat2Label: "Happy Customer",
    title: "Unleash The Shade, Car Tinting And Protection Excellence",
    description: "We're the trusted tinting experts in Malaysia. With years of experience, we deliver exceptional tinting solutions for cars.",
    features: [
      { icon: 'ShieldCheck', title: 'Expertise & Experience', description: 'We deliver exceptional tinting solutions for cars.' },
      { icon: 'Wand2', title: 'Attention To Detail', description: 'We deliver exceptional tinting solutions for cars.' },
      { icon: 'HeartHandshake', title: 'Customer Satisfaction', description: 'We deliver exceptional tinting solutions for cars.' }
    ],
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
  };

  const testimonialData = testimonialPage?.content ? JSON.parse(testimonialPage.content) : {
    carImage: "/placeholder.svg",
    testimonials: [
      {
        text: "I can't thank UVision Auto enough for the outstanding tint service they provided. They transformed my car's windows from faded and unreliable to sleek and flawlessly shaded. Their attention to detail was second to none, and the nano-ceramic film keeps my cabin cooler while blocking harmful UV rays. Plus, their expert team guided me to the perfect tint level, eliminating glare on every drive. I'm beyond impressed with their professionalism and craftsmanship - highly recommended for anyone seeking top-tier car tinting!",
        authorName: "Elsa Verina",
        authorRole: "Designation",
        authorImage: "/placeholder.svg"
      }
    ]
  };

  const testimonialsList = testimonialData.testimonials || [
    {
      text: testimonialData.text,
      authorName: testimonialData.authorName,
      authorRole: testimonialData.authorRole,
      authorImage: testimonialData.authorImage
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (testimonialsList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonialsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonialsList.length]);

  const IconMap: any = { ShieldCheck, Wand2, HeartHandshake, Star, Shield };
  
  const products = dbProducts.map(p => ({
    id: p.id, name: p.name, brand: p.brand, price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    category: p.category as any, image: p.image, images: p.images || [p.image], colors: p.colors || [],
    description: p.description || '',
    rating: Number(p.rating) || 4.5, reviews: p.reviews || 0,
    isTrending: p.is_trending || false, isNew: p.is_new || false,
  }));

  const tintingProducts = products.filter(p => p.isTrending);
  const accessoriesProducts = products.filter(p => p.isNew);

  const brands = useMemo(() => {
    const brandSet = new Set(products.map(p => p.brand).filter(Boolean));
    return Array.from(brandSet).sort();
  }, [products]);

  const trendingProducts = products.filter(p => p.isTrending);
  const newProducts = products.filter(p => p.isNew);
  const [email, setEmail] = useState('');

  const heroBanners = banners.filter(b => b.position === 'hero');
  const promoBanners = banners.filter(b => b.position === 'promo');

  const nextBanner = useCallback(() => {
    if (heroBanners.length > 1) setCurrentBanner(prev => (prev + 1) % heroBanners.length);
  }, [heroBanners.length]);

  const prevBanner = useCallback(() => {
    if (heroBanners.length > 1) setCurrentBanner(prev => (prev - 1 + heroBanners.length) % heroBanners.length);
  }, [heroBanners.length]);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(nextBanner, 5000);
    return () => clearInterval(interval);
  }, [heroBanners.length, nextBanner]);

  const getCategoryImage = (slug: string, imageUrl: string | null) =>
    imageUrl || techPlaceholder;

  const getCategoryCount = (slug: string) =>
    products.filter(p => p.category?.toLowerCase().trim() === slug.toLowerCase().trim()).length;

  const renderTitle = (title?: string) => {
    if (!title) return (
      <>PREMIUM CAR <span className="text-[#00d5b4]">TINTING AND</span> <br className="hidden md:block" />
      <span className="text-[#00d5b4]">ACCESSORIES</span> SERVICE</>
    );
    
    // Support **text** or *text* for teal color, and \n for line breaks
    const parts = title.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <span key={i} className="text-[#00d5b4]">{part.slice(1, -1)}</span>;
      }
      return <span key={i}>{part.split('\\n').map((line, j, arr) => (
        <span key={j}>
          {line}
          {j < arr.length - 1 && <br className="hidden md:block" />}
        </span>
      ))}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-background pt-16 lg:pt-32">
      <Navbar />

      {/* Static Hero Section */}
      <section className="relative w-full min-h-[90vh] bg-[#111827] flex flex-col md:justify-center pb-0 md:pb-32 pt-28">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0 bg-[#111827]">
          <AnimatePresence mode="wait">
            <motion.div key={currentBanner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
              <img 
                src={heroBanners.length > 0 ? heroBanners[currentBanner].image_url : '/placeholder.svg'} 
                alt="Car Tinting Background" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-[#13192b]/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-[#111827]/30"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center flex flex-col items-center flex-1 justify-center py-12 md:py-0">
          <span className="text-[#00d5b4] text-[13px] font-bold tracking-widest mb-6">WHO WE ARE ?</span>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-[1.2] mb-8  tracking-widest" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {renderTitle(heroBanners.length > 0 ? heroBanners[currentBanner].title : undefined)}
          </h1>

          <p className="text-gray-300 text-[13px] md:text-sm max-w-3xl mx-auto mb-10 leading-relaxed font-medium whitespace-pre-line">
            {heroBanners.length > 0 && heroBanners[currentBanner].subtitle 
              ? heroBanners[currentBanner].subtitle 
              : "We're the trusted tinting experts in Malaysia. With years of experience, we deliver exceptional car tinting solutions. Discover our commitment to superior quality and innovation today. Experience optimum heat protection for your vehicle."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 mb-14">
            <div className="flex items-center gap-3 bg-[#1a2336]/60 backdrop-blur-sm px-6 py-3.5 rounded border border-gray-700/50 w-full sm:w-auto justify-center">
              <Users className="text-white w-5 h-5 shrink-0" />
              <span className="text-white text-sm font-bold tracking-wide">Professional & Creative Staff</span>
            </div>
            <div className="flex items-center gap-3 bg-[#1a2336]/60 backdrop-blur-sm px-6 py-3.5 rounded border border-gray-700/50 w-full sm:w-auto justify-center">
              <ShieldCheck className="text-white w-5 h-5 shrink-0" />
              <span className="text-white text-sm font-bold tracking-wide">Warranties & Guarantees</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10 md:mb-0 w-full sm:w-auto">
            <Link to="/appointment" className="w-full sm:w-auto bg-[#00d5b4] text-black font-black uppercase tracking-widest text-[13px] px-10 py-4 hover:bg-[#00c0a0] transition-colors rounded-sm shadow-lg shadow-[#00d5b4]/20">
              BOOK APPOINTMENT
            </Link>
            <a href="tel:+60103660467" className="w-full sm:w-auto flex items-center justify-center gap-3 border border-gray-600 bg-transparent text-white font-bold text-[13px] tracking-widest px-10 py-4 hover:bg-white/5 transition-colors rounded-sm">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              +60103660467
            </a>
          </div>
        </div>

        {/* Info Cards */}
        <div className="relative md:absolute left-0 right-0 md:-bottom-16 z-20 w-full">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-4xl mx-auto shadow-2xl">
              <div className="bg-[#1e2434] p-10 lg:p-12 text-center md:text-left border-r border-gray-800/50">
                <h3 className="text-white font-black text-lg mb-3 tracking-wide">Expertise & Professional</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-medium">Experience optimum heat protection for your vehicle.</p>
              </div>
              <div className="bg-[#00d5b4] p-10 lg:p-12 text-center md:text-left transform md:scale-105 shadow-xl z-10">
                <h3 className="text-black font-black text-lg mb-3 tracking-wide">24/7 Ready Support</h3>
                <p className="text-gray-800 text-xs leading-relaxed font-medium">Experience optimum heat protection for your vehicle.</p>
              </div>
              <div className="bg-[#1e2434] p-10 lg:p-12 text-center md:text-left border-l border-gray-800/50">
                <h3 className="text-white font-black text-lg mb-3 tracking-wide">Free Consulting</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-medium">Experience optimum heat protection for your vehicle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Our Tinting Services */}
      <section className="py-20 lg:py-28 bg-[#111827]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-gray-800 pb-12">
            <div className="max-w-2xl">
              <span className="text-[#00d5b4] text-[11px] font-bold tracking-widest uppercase mb-4 block">OUR TINTING SERVICES</span>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Delivering <span className="text-[#00d5b4]">Superior</span> Car Tinting<br/>Solution
              </h2>
            </div>
            <div className="max-w-sm mt-6 md:mt-0 text-gray-400 text-xs leading-relaxed font-medium">
              We're the trusted tinting experts in Malaysia. With years of experience, we deliver exceptional tinting solutions for cars.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {tintingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/contact" className="inline-block bg-[#00d5b4] text-black font-black uppercase tracking-widest text-[13px] px-10 py-4 hover:bg-white transition-colors rounded-sm shadow-lg shadow-[#00d5b4]/20">
              SEE OUR FULL TINT SERVICES
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative bg-black pt-0 pb-20 overflow-hidden">
        {/* Tire mark background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none mix-blend-screen" style={{ backgroundImage: 'url("/assets/tire-mark.png")', backgroundSize: 'cover', backgroundPosition: 'right center' }}></div>

        {/* Top Stats Bar */}
        <div className="relative shadow-2xl z-10 mb-20 bg-black">
          {/* Background image for the stats bar */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {whyData.images[0] && (
              <img src={whyData.images[0]} alt="Stats background" className="w-full h-full object-cover opacity-40 grayscale" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left Side (Aligns above collage) */}
              <div className="flex flex-col justify-center items-center py-10 text-center">
                <span className="text-white font-bold text-sm tracking-wide mb-1">Any Emergency Help ? Call Us</span>
                <span className="text-[#00d5b4] font-black text-2xl md:text-3xl tracking-widest">{whyData.emergencyPhone}</span>
              </div>
              
              {/* Right Side (Aligns above text) */}
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 bg-white/10 backdrop-blur-md flex flex-col justify-center items-center py-10 px-4 border-b sm:border-b-0 sm:border-r border-white/5">
                  <span className="text-white font-black text-4xl mb-1">{whyData.stat1Value}</span>
                  <span className="text-gray-300 text-[10px] uppercase tracking-widest">{whyData.stat1Label}</span>
                </div>
                <div className="flex-1 bg-white/5 backdrop-blur-md flex flex-col justify-center items-center py-10 px-4">
                  <span className="text-white font-black text-4xl mb-1">{whyData.stat2Value}</span>
                  <span className="text-gray-300 text-[10px] uppercase tracking-widest">{whyData.stat2Label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Collage Images */}
            <div className="relative h-[350px] sm:h-[450px] lg:h-[600px] w-full block mb-10 lg:mb-0">
              {whyData.images[0] && (
                <div className="absolute top-0 left-0 w-[55%] h-[160px] sm:h-[220px] lg:h-[280px] rounded overflow-hidden shadow-2xl z-10 border-4 border-[#111827]">
                  <img src={whyData.images[0]} className="w-full h-full object-cover" alt="Service 1" />
                </div>
              )}
              {whyData.images[1] && (
                <div className="absolute bottom-4 lg:bottom-12 left-4 lg:left-8 w-[50%] h-[150px] sm:h-[200px] lg:h-[240px] rounded overflow-hidden shadow-2xl z-30 border-4 border-[#111827]">
                  <img src={whyData.images[1]} className="w-full h-full object-cover" alt="Service 2" />
                </div>
              )}
              {whyData.images[2] && (
                <div className="absolute top-[80px] sm:top-[100px] lg:top-[120px] right-0 w-[55%] h-[200px] sm:h-[260px] lg:h-[320px] rounded overflow-hidden shadow-2xl z-20 border-4 border-[#111827]">
                  <img src={whyData.images[2]} className="w-full h-full object-cover" alt="Service 3" />
                </div>
              )}
            </div>

            {/* Right Content */}
            <div className="container mx-auto px-4 lg:px-8">
              <span className="text-[#00d5b4] text-[11px] font-bold tracking-widest uppercase mb-4 block">WHY CHOOSE US ?</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 tracking-wide uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {whyData.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed font-medium mb-12">
                {whyData.description}
              </p>

              <div className="space-y-8">
                {whyData.features.map((feature: any, idx: number) => {
                  const Icon = IconMap[feature.icon] || Star;
                  return (
                    <div key={idx} className="flex gap-5">
                      <div className="w-14 h-14 shrink-0 bg-[#00d5b4]/10 rounded flex items-center justify-center border border-[#00d5b4]/20">
                        <Icon className="w-6 h-6 text-[#00d5b4]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Accessories Services */}
      <section className="py-20 lg:py-28 bg-[#1e2434]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-gray-700 pb-12">
            <div className="max-w-2xl">
              <span className="text-[#00d5b4] text-[11px] font-bold tracking-widest uppercase mb-4 block">ACCESSORIES SERVICES</span>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Delivering <span className="text-[#00d5b4]">Superior</span> Car Tinting &<br/>Protection <span className="text-[#00d5b4]">Solutions</span>
              </h2>
            </div>
            <div className="max-w-sm mt-6 md:mt-0 text-gray-400 text-xs leading-relaxed font-medium">
              We're the trusted tinting experts in Malaysia. With years of experience, we deliver exceptional tinting solutions for cars.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-6 mb-16">
            {accessoriesProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/contact" className="inline-block bg-[#00d5b4] text-black font-black uppercase tracking-widest text-[13px] px-10 py-4 hover:bg-white transition-colors rounded-sm shadow-lg shadow-[#00d5b4]/20">
              SEE OUR FULL ASSESORIES SERVICES
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 lg:py-28 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#00d5b4] text-[11px] font-bold tracking-widest uppercase mb-4 block">TESTIMONIAL</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              What They Say <span className="text-[#00d5b4]">About Us</span> ?
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row w-full shadow-2xl overflow-hidden rounded-sm">
            {/* Left Content */}
            <div className="lg:w-1/2 bg-[#2a2f42] p-10 lg:p-16 flex flex-col justify-center min-h-[450px]">
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-gray-200 text-[13px] leading-[1.8] font-medium mb-10 transition-all duration-500">
                  {testimonialsList[currentTestimonial].text}
                </p>
                <div className="flex items-center gap-4 transition-all duration-500">
                  <img src={testimonialsList[currentTestimonial].authorImage} alt={testimonialsList[currentTestimonial].authorName} className="w-14 h-14 rounded-full object-cover bg-white" />
                  <div>
                    <h4 className="text-[#00d5b4] font-black text-base tracking-wide mb-1">{testimonialsList[currentTestimonial].authorName}</h4>
                    <span className="text-gray-400 text-[11px] font-medium">{testimonialsList[currentTestimonial].authorRole}</span>
                  </div>
                </div>
              </div>

              {testimonialsList.length > 1 && (
                <div className="flex justify-start gap-2 mt-12">
                  {testimonialsList.map((_: any, idx: number) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentTestimonial(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentTestimonial ? 'bg-[#00d5b4] w-8' : 'bg-gray-600 hover:bg-gray-500 w-2'}`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Right Image */}
            <div className="lg:w-1/2 bg-[#2a2f42] relative min-h-[350px] lg:min-h-auto">
              {testimonialData.carImage && testimonialData.carImage !== '/placeholder.svg' ? (
                <img src={testimonialData.carImage} alt="Happy Customer" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <img src="/placeholder.svg" alt="Happy Customer Placeholder" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-[#161a23]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
            
            {/* Left: Form */}
            <div className="w-full md:w-[55%]">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Number <span className="text-[#00d5b4]">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Your Number Here" 
                      value={contactForm.number}
                      onChange={e => setContactForm({...contactForm, number: e.target.value})}
                      className="w-full bg-white px-4 py-3 text-sm text-black focus:outline-none placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Email <span className="text-[#00d5b4]">*</span></label>
                    <input 
                      type="email" 
                      placeholder="Your Email Here" 
                      value={contactForm.email}
                      onChange={e => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full bg-white px-4 py-3 text-sm text-black focus:outline-none placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Address</label>
                  <input 
                    type="text" 
                    placeholder="Your Address Here" 
                    value={contactForm.address}
                    onChange={e => setContactForm({...contactForm, address: e.target.value})}
                    className="w-full bg-white px-4 py-3 text-sm text-black focus:outline-none placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Message <span className="text-[#00d5b4]">*</span></label>
                  <textarea 
                    placeholder="Input Message Here" 
                    rows={4}
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full bg-white px-4 py-3 text-sm text-black focus:outline-none placeholder-gray-400 resize-none"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={submittingContact}
                  className="w-full bg-[#00d5b4] hover:bg-[#00c0a3] text-black font-black uppercase tracking-widest text-[13px] py-4 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> {submittingContact ? 'SENDING...' : 'SUBMIT NOW'}
                </button>
              </form>
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-[45%]">
              <span className="text-[#00d5b4] text-[13px] font-bold tracking-widest uppercase mb-2 block">CONTACT US</span>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Get In Touch
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-10 max-w-lg">
                We're the trusted tinting experts in Malaysia. With years of experience, we deliver exceptional tinting solutions for cars.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div>
                  <h4 className="text-[#00d5b4] font-medium text-sm mb-3">Our Address</h4>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#00d5b4] shrink-0 mt-0.5" />
                    <p className="text-white text-sm leading-relaxed">
                      {settings?.contact_address || '119, Jln SBC 1, Taman Sri Batu Caves, 68100 Batu Caves, Selangor'}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[#00d5b4] font-medium text-sm mb-3">Call Us</h4>
                  <div className="flex items-start gap-3 mb-6">
                    <Phone className="w-5 h-5 text-[#00d5b4] shrink-0" />
                    <p className="text-white text-sm font-medium">
                      {settings?.contact_phone || '+60 11-6950 1634'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {settings?.facebook_url && (
                      <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#00d5b4] rounded flex items-center justify-center hover:bg-white transition-colors">
                        <Facebook className="w-4 h-4 text-black" />
                      </a>
                    )}
                    {settings?.instagram_url && (
                      <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#00d5b4] rounded flex items-center justify-center hover:bg-white transition-colors">
                        <Instagram className="w-4 h-4 text-black" />
                      </a>
                    )}
                    <a href="#" className="w-8 h-8 bg-[#00d5b4] rounded flex items-center justify-center hover:bg-white transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                        <path d="M15 8a4 4 0 1 0 0-8c0 2.5 2 4.5 4.5 4.5V8a4 4 0 0 1-4-4"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a href="https://maps.app.goo.gl/XeihvznitHPvkU6bA" target="_blank" rel="noopener noreferrer" className="bg-transparent border border-[#00d5b4] text-[#00d5b4] hover:bg-[#00d5b4] hover:text-black font-black uppercase tracking-wider text-[12px] px-6 py-3 transition-colors flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> GOOGLE MAP
                </a>
                <a href={`https://waze.com/ul?q=${encodeURIComponent(settings?.contact_address || 'Taman Sri Batu Caves')}`} target="_blank" rel="noopener noreferrer" className="bg-[#00d5b4] text-black hover:bg-white font-black uppercase tracking-wider text-[12px] px-6 py-3 transition-colors flex items-center gap-2">
                  <Navigation className="w-4 h-4" /> WAZE DIRECTION
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
