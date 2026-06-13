import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1f2e] border border-gray-800 rounded flex flex-col items-center group shadow-xl hover:border-teal-500/30 transition-all duration-300"
    >
      {/* Top Image Banner */}
      <div className="w-full aspect-square bg-white overflow-hidden relative border-b-2 border-gray-800">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          loading="lazy" 
        />
      </div>

      {/* Content Area */}
      <div className="w-full p-6 text-center flex flex-col flex-grow">
        <h3 className="font-heading text-teal-400 text-lg font-bold mb-2 tracking-wide">
          {product.name}
        </h3>
        
        <div className="text-white font-black text-4xl mb-6 tracking-wider">
          RM{product.price}
        </div>

        {/* Specs List */}
        <div className="flex flex-col flex-grow w-full border-t border-gray-700/50">
          {specs.map((spec, index) => (
            <div 
              key={index} 
              className="py-3 border-b border-gray-700/50 text-gray-300 text-xs font-medium tracking-wide"
            >
              {spec}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-8 mb-2">
          <Link 
            to="/appointment" 
            className="inline-block border border-teal-400 text-white text-[11px] font-bold tracking-widest uppercase px-8 py-2.5 hover:bg-teal-400 hover:text-black transition-colors"
          >
            APPOINTMENT
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
