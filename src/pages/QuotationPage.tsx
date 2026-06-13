import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCreateQuotation } from '@/hooks/useQuotations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const QuotationPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const createQuotation = useCreateQuotation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    company_name: '',
    company_reg_no: '',
    company_address: '',
    contact_number: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.customer_email || !formData.contact_number) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createQuotation.mutateAsync({
        ...formData,
        cart_items: cartItems,
        cart_total: cartTotal,
      });
      
      toast.success('Your quotation request has been submitted successfully!');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Quotation submission error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 lg:pt-40 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden"
          >
            <div className="p-6 md:p-10">
              {/* Header Info */}
              <div className="mb-8 space-y-4">
                <p className="text-sm text-gray-500 italic">
                  This Service is specially design for corporate customer that need to get a quotation for their offices.
                </p>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-3">Please follow the step below to get a quote from us.</p>
                  <ol className="text-xs text-blue-700 space-y-2 list-decimal pl-4">
                    <li>Search Product and Add to cart</li>
                    <li>Fill up detail</li>
                    <li>If there is any special product / requirement please fill up the message box</li>
                    <li>Submit</li>
                    <li>And official quotation will send to you in the next working day.</li>
                  </ol>
                </div>
                <p className="text-sm text-gray-600">
                  Please do not hesitate to contact us if you need any further assistant. Thank you.
                </p>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-100">Request For Quote</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Name *</Label>
                  <Input 
                    id="customer_name" 
                    name="customer_name" 
                    value={formData.customer_name} 
                    onChange={handleChange} 
                    required 
                    className="bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_email">Email address *</Label>
                  <Input 
                    type="email" 
                    id="customer_email" 
                    name="customer_email" 
                    value={formData.customer_email} 
                    onChange={handleChange} 
                    required 
                    className="bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input 
                    id="company_name" 
                    name="company_name" 
                    value={formData.company_name} 
                    onChange={handleChange} 
                    required 
                    className="bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_reg_no">Company Registration No. *</Label>
                  <Input 
                    id="company_reg_no" 
                    name="company_reg_no" 
                    value={formData.company_reg_no} 
                    onChange={handleChange} 
                    required 
                    className="bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_address">Company Address *</Label>
                  <Textarea 
                    id="company_address" 
                    name="company_address" 
                    value={formData.company_address} 
                    onChange={handleChange} 
                    required 
                    className="bg-gray-50 focus:bg-white transition-colors min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number *</Label>
                  <Input 
                    id="contact_number" 
                    name="contact_number" 
                    value={formData.contact_number} 
                    onChange={handleChange} 
                    required 
                    className="bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Information / Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Tell us more about your requirements..." 
                    className="bg-gray-50 focus:bg-white transition-colors min-h-[120px]"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-32 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold border border-gray-200"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default QuotationPage;
