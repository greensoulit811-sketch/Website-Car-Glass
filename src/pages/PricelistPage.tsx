import { useState } from 'react';
import { useActiveProducts } from '@/hooks/useDatabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, Search } from 'lucide-react';

const PricelistPage = () => {
  const { data: products = [], isLoading } = useActiveProducts();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'dealer@brightbeam.com' && password === 'dealer123') {
      setIsLoggedIn(true);
      toast.success('Successfully logged in as Dealer');
    } else {
      toast.error('Invalid credentials. Please contact us to become a dealer.');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.brand || '').toLowerCase().includes(search.toLowerCase())
  );

  const googleSheetUrl = "https://docs.google.com/spreadsheets/d/1O-H09_0fWLpuiaY_6kLnZsFTg6zFKnauXGl49aJLTAA/edit?usp=sharing"; 
   return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 lg:pt-40 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {!isLoggedIn ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-gray-100 p-8 rounded shadow-sm"
            >
              <h1 className="text-lg font-medium text-gray-800 mb-6">Computer Components & Accessories</h1>
              
              <div className="mb-6">
                <a href={googleSheetUrl} target="_blank" rel="noopener noreferrer">
                  <Button 
                    className="bg-[#222] text-white hover:bg-black font-bold uppercase tracking-wider px-8 rounded-sm h-11"
                  >
                    DOWNLOAD PRICELIST
                  </Button>
                </a>
                <p className="text-[11px] text-gray-400 italic mt-3">
                  Latest Updates on {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm text-red-500 italic mb-6">Please login to download dealer pricelist.</p>

                <form onSubmit={handleLogin} className="space-y-5 max-w-xl">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-500 font-normal">Username / Email</Label>
                    <Input 
                      id="email" 
                      type="text" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#f5f5f5] border-none rounded-none h-12 focus-visible:ring-1 focus-visible:ring-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-500 font-normal">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#f5f5f5] border-none rounded-none h-12 focus-visible:ring-1 focus-visible:ring-gray-200"
                    />
                  </div>
                  <Button type="submit" className="bg-[#333] text-white hover:bg-black px-10 rounded-sm h-11 font-bold">LOGIN</Button>
                </form>

                <p className="text-xs text-gray-600 mt-8 italic cursor-pointer hover:underline">How to become our dealer?</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Dealer Header */}
              <div className="bg-gray-50 p-6 rounded border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Dealer Pricelist Dashboard</h1>
                  <p className="text-xs text-gray-500 mt-1">Authorized dealer access granted</p>
                </div>
                <div className="flex gap-2">
                  <a href={googleSheetUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-[#222] text-white gap-2 font-bold uppercase text-xs tracking-widest">
                      <FileSpreadsheet className="w-4 h-4" /> Google Sheets
                    </Button>
                  </a>
                  <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)} className="rounded-none font-bold uppercase text-[10px] tracking-widest">Logout</Button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-gray-100 rounded overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                   <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <Input placeholder="Filter products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filteredProducts.length} Products</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200 font-bold text-[10px] uppercase text-gray-500 tracking-widest">
                        <th className="p-4">Brand</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Price</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm italic">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-black text-blue-800">{p.brand || '---'}</td>
                          <td className="p-4 text-gray-700">{p.name}</td>
                          <td className="p-4 font-black">RM {Number(p.price).toFixed(2)}</td>
                          <td className="p-4 text-right">
                             <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${Number(p.stock) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{Number(p.stock) > 0 ? 'In Stock' : 'Out'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PricelistPage;
