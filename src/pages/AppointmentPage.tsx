import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSettings, useProducts, useBanners, usePageContent } from '@/hooks/useDatabase';
import { useActiveCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, User, Car, RefreshCw } from 'lucide-react';

// Hardcoded data for demonstration based on screenshots
const LOCATIONS = [
  { id: 'batu_caves', title: 'Batu Caves', address: '119, Jln SBC 1, Taman Sri Batu Caves, 68100 Batu Caves, Selangor' },
  { id: 'setia_alam', title: 'Setia Alam', address: '44-GF, Jalan Setia Perdana BF U13/BF, Setia Alam, 40170 Shah Alam, Selangor' }
];

const CATEGORIES = [
  { id: 'tint', title: 'Tint', count: '6 Services' }
];

const SERVICES = [
  { id: 'basic', title: 'Basic Package', description: 'Nano Carbon\n2 Ply / 1.5mm Thickness Film\nUV Protection 100%\nIR Rejection 60-65%\nTSER 55%\n1 Year Warranty', price: 149 },
  { id: 'premium', title: 'Premium Package', description: 'Nano Ceramic 2X HD\n2 Ply / 2mm Thickness Film\nUV Protection 99%\nIR Rejection 90%\nTSER 60%\n3 Year Warranty', price: 290 },
  { id: 'elite', title: 'Elite Package', description: 'Nano Ceramic 4X HD\n2.5 Ply / 2mm Thickness Film\nUV Protection 100%\nIR Rejection 95%\nTSER 85%\n5 Year Warranty', price: 399 },
  { id: 'ultra', title: 'Ultra Package', description: 'Nano Ceramic 4X Max\n3 Ply / 2mm Thickness Film\nUV Protection 100%\nIR Rejection 98%\nTSER 88%\n7 Year Warranty', price: 588 },
  { id: 'supreme', title: 'Supreme Package', description: 'Sputter MultiLayer Ultra HD\n3 Ply / 2mm Thickness Film\nUV Protection 100%\nIR Rejection 100%\nTSER 90%\n10 Year Warranty', price: 799 },
  { id: 'chameleon', title: 'Chameleon Package', description: 'Blue, Green, Red, Purple\n2 Ply / 2mm Thickness Film\nUV Protection 100%\nIR Rejection 95%\nTSER 85%\n5 Year Warranty', price: 799 },
];

const TIME_SLOTS = [
  '09:00 am', '10:00 am', '11:00 am', '12:00 pm',
  '01:00 pm', '02:00 pm', '03:00 pm', '04:00 pm',
  '05:00 pm', '06:00 pm', '07:00 pm', '08:00 pm'
];

export default function AppointmentPage() {
  const { data: settings } = useSettings();
  const { data: dbProducts = [] } = useProducts();
  const { data: dbCategories = [] } = useActiveCategories();
  const { data: banners = [] } = useBanners();
  const { data: homeContent } = usePageContent('home');

  const whyData = homeContent?.content?.whyChooseUs || {
    title: 'Top Tier Service',
    description: 'We deliver exceptional tinting solutions.',
    emergencyPhone: '+60 11-6950 1634',
    stat1Value: '250+', stat1Label: 'Project Complete',
    stat2Value: '1.5K', stat2Label: 'Happy Costumer',
    images: [],
    features: []
  };

  // Find a banner with title containing "Appointment" or "appointment" 
  const appointmentBanner = banners.find(b => b.is_active && b.title.toLowerCase().includes('appointment'));

  const activeCategories = dbCategories.length > 0 ? dbCategories.map(c => ({
    id: c.slug,
    title: c.name,
    count: `${dbProducts.filter(p => p.category === c.slug).length} Services`
  })) : CATEGORIES;

  const activeServices = dbProducts.length > 0 ? dbProducts.map(p => ({
    id: p.id,
    categoryId: p.category,
    title: p.name,
    description: p.description || '',
    price: p.price
  })) : SERVICES;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Form State
  const [location, setLocation] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    carModel: '',
    numberPlate: '',
    note: ''
  });

  // Calendar logic
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday=0, Sunday=6
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPastTime = (timeStr: string) => {
    if (!date) return false;
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();
    
    if (!isToday) return false;

    const [timeVal, modifier] = timeStr.toLowerCase().split(' ');
    let [hours, minutes] = timeVal.split(':').map(Number);
    
    if (modifier === 'pm' && hours < 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    
    const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    return slotTime < now;
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!userInfo.firstName || !userInfo.phone || !userInfo.email || !userInfo.carModel || !userInfo.numberPlate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.from('checkout_leads').insert({
        customer_name: `${userInfo.firstName} ${userInfo.lastName}`,
        customer_phone: userInfo.phone,
        customer_email: userInfo.email,
        shipping_address: location.address,
        notes: `Car: ${userInfo.carModel} (${userInfo.numberPlate})\nNote: ${userInfo.note}`,
        cart_items: {
          service: service,
          date: date,
          time: time,
          location: location.title
        },
        cart_total: service.price,
        status: 'appointment',
        session_id: 'appt_' + Date.now()
      });

      if (error) throw error;
      setCompleted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const renderSidebarContext = () => {
    switch (step) {
      case 1:
        return { title: 'Location Selections', desc: 'Please select a location for your appointment', icon: <MapPin className="w-10 h-10 text-[#00d5b4]" /> };
      case 2:
      case 3:
        return { title: 'Service Selection', desc: 'Please select a service for which you want to schedule an appointment', icon: <RefreshCw className="w-10 h-10 text-[#00d5b4]" /> };
      case 4:
        return { title: 'Select Date & Time', desc: 'Please select date and time for your appointment', icon: <CalendarIcon className="w-10 h-10 text-[#00d5b4]" /> };
      case 5:
        return { title: 'Enter Your Information', desc: 'Please enter your contact information', icon: <User className="w-10 h-10 text-[#00d5b4]" /> };
      default: return null;
    }
  };

  const ctx = renderSidebarContext();

  return (
    <div className="min-h-screen bg-[#0a0f1a] pt-20">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[250px] md:h-[350px] w-full bg-[#1a1f2e] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img src={appointmentBanner?.image_url || "/placeholder.svg"} alt="Appointment" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px]" />
        <h1 className="relative z-20 text-4xl md:text-5xl font-black text-white tracking-widest uppercase text-center px-4">
          {appointmentBanner?.title || 'Appointment'}
        </h1>
        {appointmentBanner?.subtitle && (
          <p className="absolute bottom-10 z-20 text-white/80 text-lg md:text-xl font-medium px-4 text-center">
            {appointmentBanner.subtitle}
          </p>
        )}
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        {completed ? (
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-12 text-center shadow-2xl">
            <CheckCircle2 className="w-20 h-20 text-[#00d5b4] mx-auto mb-6" />
            <h2 className="text-3xl font-black text-black mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-8">
              Thank you, {userInfo.firstName}! Your appointment for <strong>{service?.title}</strong> on <strong>{date?.toLocaleDateString()} at {time}</strong> at our <strong>{location?.title}</strong> branch has been received.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-[#00d5b4] text-black font-bold uppercase tracking-widest px-8 py-3 rounded hover:bg-black hover:text-white transition-colors"
            >
              Return Home
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white">Book An Appointment</h2>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
              
              {/* Left Sidebar Context */}
              <div className="md:w-[280px] bg-white border-r border-gray-200 p-8 flex flex-col justify-between shrink-0">
                <div className="text-center pt-8">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    {ctx?.icon}
                  </div>
                  <h3 className="text-lg font-black text-black mb-2">{ctx?.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{ctx?.desc}</p>
                </div>
                
                <div className="text-center pb-4 mt-12">
                  <h4 className="text-sm font-black text-black mb-1">Any Help?</h4>
                  <p className="text-sm text-gray-500">Call {settings?.contact_phone || '(+60) 116 950-1634'}</p>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 overflow-y-auto max-h-[600px] custom-scrollbar">
                  
                  {/* Step 1: Location */}
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-lg font-black text-black mb-6 border-b pb-4">Select Location</h3>
                      <div className="space-y-4">
                        {LOCATIONS.map(loc => (
                          <div 
                            key={loc.id} 
                            onClick={() => { setLocation(loc); handleNext(); }}
                            className={`border rounded-lg p-4 flex gap-4 cursor-pointer transition-all ${location?.id === loc.id ? 'border-[#00d5b4] bg-green-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center shrink-0">
                              <MapPin className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-black mb-1">{loc.title}</h4>
                              <p className="text-xs text-gray-500">{loc.address}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Category */}
                  {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-lg font-black text-black mb-6 border-b pb-4">Select Services</h3>
                      <div className="space-y-4">
                        {activeCategories.map(cat => (
                          <div 
                            key={cat.id} 
                            onClick={() => { setCategory(cat); handleNext(); }}
                            className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${category?.id === cat.id ? 'border-[#00d5b4] bg-green-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center shrink-0">
                                <RefreshCw className="w-5 h-5 text-gray-400" />
                              </div>
                              <h4 className="font-bold text-sm text-black">{cat.title}</h4>
                            </div>
                            <span className="text-xs text-[#00d5b4] font-medium">{cat.count}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Service Package */}
                  {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-lg font-black text-black mb-6 border-b pb-4">Select Services</h3>
                      <div className="space-y-4">
                        {activeServices.filter(svc => !category || svc.categoryId === category.id || dbCategories.length === 0).map(svc => (
                          <div 
                            key={svc.id} 
                            onClick={() => { setService(svc); handleNext(); }}
                            className={`border rounded-lg p-4 flex gap-4 cursor-pointer transition-all ${service?.id === svc.id ? 'border-[#00d5b4] bg-green-50/50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <div className="w-12 h-12 rounded bg-[#0a0f1a] flex items-center justify-center shrink-0 text-white font-bold text-xs">
                              PRO
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-sm text-black">{svc.title}</h4>
                                <span className="text-[#00d5b4] font-bold text-sm">RM{svc.price}</span>
                              </div>
                              <p className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed">{svc.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4 & 5 Placeholders */}
                  {step >= 4 && (
                    <div className="flex h-full gap-8">
                      {/* Left form area */}
                      <div className="flex-1">
                        {step === 4 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 className="text-lg font-black text-black mb-6 border-b pb-4">Date & Time Selection</h3>
                            {/* Calendar placeholder */}
                            <div className="mb-8">
                              <div className="flex justify-between items-center mb-6">
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
                                <span className="font-bold text-sm">
                                  {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
                                </span>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                              </div>
                              <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2 text-gray-400 font-bold uppercase">
                                <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
                              </div>
                              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                  <div key={`empty-${i}`} />
                                ))}
                                {Array.from({length: daysInMonth}).map((_, i) => {
                                  const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                                  const isPast = cellDate < today;
                                  const isSelected = date?.getDate() === i + 1 && date?.getMonth() === currentMonth.getMonth() && date?.getFullYear() === currentMonth.getFullYear();
                                  
                                  return (
                                    <button 
                                      key={i} 
                                      disabled={isPast}
                                      onClick={() => setDate(cellDate)}
                                      className={`p-2 rounded transition-colors ${
                                        isSelected 
                                          ? 'bg-[#00d5b4] text-white font-bold' 
                                          : isPast 
                                            ? 'text-gray-300 cursor-not-allowed' 
                                            : 'hover:bg-gray-100 text-black font-medium'
                                      }`}
                                    >
                                      {i + 1}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <div className="text-center mb-4 text-sm font-bold border-t pt-6">Pick a slot for {date ? date.toLocaleDateString() : 'selected date'}</div>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                              {TIME_SLOTS.map(t => {
                                const isPast = isPastTime(t);
                                return (
                                  <button 
                                    key={t}
                                    onClick={() => !isPast && setTime(t)}
                                    disabled={isPast}
                                    className={`py-2 text-xs font-bold rounded transition-colors ${
                                      isPast 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                        : time === t 
                                          ? 'bg-[#00d5b4] text-white' 
                                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                            
                            <div className="mt-8 text-right">
                              <button 
                                onClick={handleNext}
                                disabled={!date || !time}
                                className="bg-[#00d5b4] text-white px-6 py-2 rounded text-sm font-bold disabled:opacity-50"
                              >
                                Next 
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {step === 5 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                              <h3 className="text-lg font-black text-black">Your Information</h3>
                              <button className="text-xs text-[#00d5b4] font-bold">Logout</button>
                            </div>
                            <h4 className="text-sm font-bold text-[#00d5b4] mb-4 border-b pb-2 inline-block">Contact Information</h4>
                            
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">First Name</label>
                                  <input type="text" value={userInfo.firstName} onChange={e => setUserInfo({...userInfo, firstName: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="Plato" />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Last Name</label>
                                  <input type="text" value={userInfo.lastName} onChange={e => setUserInfo({...userInfo, lastName: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="Farley" />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Phone Number</label>
                                <input type="text" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="+60 14-744 9356" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Email Address</label>
                                <input type="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="email@example.com" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Car Model</label>
                                <input type="text" value={userInfo.carModel} onChange={e => setUserInfo({...userInfo, carModel: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="Honda Civic" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Number Plate</label>
                                <input type="text" value={userInfo.numberPlate} onChange={e => setUserInfo({...userInfo, numberPlate: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="VBA 1234" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Note</label>
                                <textarea value={userInfo.note} onChange={e => setUserInfo({...userInfo, note: e.target.value})} className="w-full border rounded p-2 text-sm h-20 resize-none" placeholder="Any special requests?"></textarea>
                              </div>
                            </div>
                            
                            <div className="mt-8 flex justify-between items-center">
                              <button onClick={handleBack} className="text-gray-500 text-sm font-bold flex items-center gap-1 hover:text-black">
                                <ArrowLeft className="w-4 h-4" /> Back
                              </button>
                              <button 
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#00d5b4] text-white px-6 py-2 rounded text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                              >
                                {loading ? 'Processing...' : 'Checkout ->'}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Right Summary Area */}
                      <div className="w-[250px] border-l pl-8 shrink-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center border-b pb-4 mb-6">
                            <h3 className="font-black text-black">Summary</h3>
                            {step === 5 && <span className="text-[#00d5b4] text-xs font-bold cursor-pointer">Checkout -&gt;</span>}
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-bold text-black">{service?.title}</h4>
                                <p className="text-xs text-gray-500">{date?.toLocaleDateString()} {time}</p>
                              </div>
                              <span className="text-gray-400 bg-gray-100 rounded px-1 text-[10px] cursor-pointer" onClick={() => setStep(3)}>Edit</span>
                            </div>
                            
                            {step === 5 && (
                              <>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Location</span>
                                  <span className="font-bold text-black flex items-center gap-1">{location?.title} <span className="text-[#00d5b4] cursor-pointer" onClick={() => setStep(1)}><ArrowLeft className="w-3 h-3 rotate-45" /></span></span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Customer</span>
                                  <span className="font-bold text-black">{userInfo.firstName} {userInfo.lastName}</span>
                                </div>
                                <div className="text-[#00d5b4] text-xs font-bold cursor-pointer text-right">+ Add More</div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-8 border-t pt-4">
                          <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Cost Breakdown</h4>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-500">{service?.title}</span>
                            <span className="font-bold">RM {service?.price}</span>
                          </div>
                          <div className="flex justify-between text-sm font-black border-t pt-2 mt-2">
                            <span>Total Price</span>
                            <span>RM {service?.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer Back Button for Steps 2 & 3 */}
                {(step === 2 || step === 3) && (
                  <div className="p-4 border-t border-gray-100 flex items-center">
                    <button onClick={handleBack} className="text-gray-500 text-sm font-bold flex items-center gap-1 hover:text-black">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Top Stats Bar imported from Homepage */}
      <div className="relative shadow-2xl z-10 bg-black mt-16 pt-0 pb-0">
        {/* Background image for the stats bar */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {whyData.images && whyData.images[0] && (
            <img src={whyData.images[0]} alt="Stats background" className="w-full h-full object-cover opacity-40 grayscale" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Side */}
            <div className="flex flex-col justify-center items-center py-10 text-center">
              <span className="text-white font-bold text-sm tracking-wide mb-1">Any Emergency Help ? Call Us</span>
              <span className="text-[#00d5b4] font-black text-2xl md:text-3xl tracking-widest">{whyData.emergencyPhone}</span>
            </div>
            
            {/* Right Side */}
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

      <Footer />
    </div>
  );
}
