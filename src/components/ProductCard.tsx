import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Parse description by newlines to get specs
  const specs = product.description 
    ? product.description.split(/\\n|\n/).filter(line => line.trim() !== '') 
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        type: "spring", 
        bounce: 0.4 
      }}
      className="relative bg-gradient-to-b from-[#1a1f2e] to-[#0f121b] rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-xl"
    >
      <div className="relative z-10 flex flex-col h-full border border-gray-800/80 rounded-2xl overflow-hidden transition-colors duration-500">
        {/* Top Image Banner */}
        <div className="w-full aspect-[3/4] lg:aspect-[3/3] bg-white/5 overflow-hidden relative">
          <div className="absolute inset-0"></div>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
            loading="lazy" 
          />
        </div>

        {/* Content Area */}
        <div className="w-full p-6 md:p-8 flex flex-col flex-grow relative bg-transparent">
          <h3 className="font-heading text-[#F59E0B] text-xl md:text-2xl font-bold mb-2 tracking-wide group-hover:text-white transition-colors duration-300">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-gray-400 font-bold text-sm tracking-widest">RM</span>
            <span className="text-white font-black text-4xl md:text-5xl tracking-wider">{product.price}</span>
          </div>

          {/* Specs List */}
          <div className="flex flex-col flex-grow w-full space-y-4 mb-8">
            {specs.map((spec, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 text-gray-300 text-lg md:text-sm font-medium tracking-wide"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                <span className="leading-relaxed">{spec}</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-auto pt-6 border-t border-gray-800/80">
            <Link 
              to="/appointment" 
              className="block w-full text-center bg-[#F59E0B] text-black text-[12px] font-black tracking-widest uppercase px-6 py-3.5 rounded-lg transition-all shadow-lg shadow-[#F59E0B]/20 hover:bg-white"
            >
              BOOK APPOINTMENT
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
