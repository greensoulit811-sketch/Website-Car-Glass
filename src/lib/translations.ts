export type Language = 'en' | 'bn';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.shop': 'Shop',

    // Hero
    'hero.fuel': 'READY FOR',
    'hero.game': 'SUCCESS',
    'hero.subtitle': 'Authorized ASUS, HP, Dell, Lenovo & more. Fast delivery across Malaysia.',
    'hero.shop_now': 'Upgrade Now',

    // Categories
    'categories.browse': 'Search',
    'categories.title': 'Shop by Tech',
    'categories.all': 'All Devices',
    'categories.products': 'Products',

    // Trending
    'trending.label': 'Hot Right Now',
    'trending.title': 'Trending',
    'trending.view_all': 'View All',

    // New Arrivals
    'new.label': 'Just Dropped',
    'new.title': 'New Arrivals',

    // Why Choose Us
    'why.label': 'The Bright Beam Difference',
    'why.title': 'Why Tech Lovers Choose Us',
    'why.authentic': '100% Genuine',
    'why.authentic_desc': 'Every machine verified original. Directly from authorized distributors.',
    'why.performance': 'High Performance',
    'why.performance_desc': 'Latest processors from Intel, AMD & NVIDIA graphics.',
    'why.delivery': 'Fast Delivery',
    'why.delivery_desc': 'Express delivery across Malaysia. Same-day in Kuala Lumpur.',
    'why.returns': 'Easy Returns',
    'why.returns_desc': '30-day hassle-free returns. No questions asked.',

    // Reviews
    'reviews.label': 'Ratings',
    'reviews.title': 'What Customers Say',

    // Newsletter
    'newsletter.label': 'Stay Updated',
    'newsletter.title': 'Get Tech Deals',
    'newsletter.subtitle': 'Early access to new releases, flash sales, and tech updates.',
    'newsletter.placeholder': 'Enter your email',
    'newsletter.subscribe': 'Subscribe',

    // Shop Page
    'shop.collection': 'Collection',
    'shop.all_products': 'All Products',
    'shop.search': 'Search laptops, brands...',
    'shop.filters': 'Filters',
    'shop.categories': 'Categories',
    'shop.brands': 'Brands',
    'shop.all_brands': 'All Brands',
    'shop.price': 'Price (RM)',
    'shop.products_found': 'products found',
    'shop.loading': 'Loading products...',
    'shop.no_results': 'No Results',
    'shop.adjust_filters': 'Try adjusting your filters',

    // Product Page
    'product.reviews': 'reviews',
    'product.in_stock': 'in stock',
    'product.out_of_stock': 'Out of stock',
    'product.select_size': 'Select Size',
    'product.color': 'Color',
    'product.add_to_cart': 'Add to Cart',
    'product.buy_now': 'Buy Now',
    'product.authentic': '100% Authentic - Verified by Bright Beam',
    'product.free_delivery': 'Free delivery across Malaysia on orders over RM 150',
    'product.return_policy': '30-day easy return policy',
    'product.cod': 'Cash on Delivery available',
    'product.related': 'You May Also Like',
    'product.not_found': 'Product Not Found',
    'product.back_to_shop': 'Back to Shop',
    'product.select_size_error': 'Please select a size',
    'product.select_color_error': 'Please select a color',
    'product.out_of_stock_error': 'This variation is out of stock',
    'product.added_to_cart': 'added to cart!',

    // Cart Page
    'cart.title': 'Your Cart',
    'cart.empty': 'Cart is Empty',
    'cart.empty_subtitle': 'Time to upgrade your tech',
    'cart.order_summary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.cod_available': 'Cash on Delivery available 🇲🇾',

    // Checkout Page
    'checkout.title': 'Checkout',
    'checkout.back_to_cart': 'Back to Cart',
    'checkout.contact_info': 'Contact Information',
    'checkout.full_name': 'Full Name',
    'checkout.phone': 'Phone',
    'checkout.email': 'Email',
    'checkout.shipping_address': 'Shipping Address',
    'checkout.area': 'Area',
    'checkout.block': 'Block',
    'checkout.street': 'Street & Building',
    'checkout.notes': 'Notes',
    'checkout.delivery_instructions': 'Delivery instructions...',
    'checkout.shipping_method': 'Shipping Method',
    'checkout.no_shipping': 'No shipping methods available',
    'checkout.payment_method': 'Payment Method',
    'checkout.cod': 'Cash on Delivery (COD)',
    'checkout.cod_desc': 'Pay when you receive your order',
    'checkout.place_order': 'Place Order',
    'checkout.placing': 'Placing Order...',
    'checkout.order_confirmed': 'Order Confirmed! 🎉',
    'checkout.order_placed': 'has been placed',
    'checkout.payment_cod': 'Payment: Cash on Delivery 🇲🇾',
    'checkout.continue_shopping': 'Continue Shopping',
    'checkout.go_home': 'Go Home',
    'checkout.fill_required': 'Please fill in all required fields',
    'checkout.order_success': 'Order placed successfully!',
    'checkout.order_failed': 'Failed to place order. Please try again.',

    // Wishlist
    'wishlist.title': 'Wishlist',
    'wishlist.empty': 'No Saved Items',
    'wishlist.empty_subtitle': 'Save your favorite tech here',
    'wishlist.browse': 'Browse Collection',

    // Footer
    'footer.shop': 'Shop',
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.contact': 'Contact Us',
    'footer.contact_title': 'Contact',
    'footer.whatsapp': 'WhatsApp',
    'footer.all_products': 'All Products',

    // Product Card
    'card.new': 'New',
    'card.sale': 'Sale',

    // General
    'loading': 'Loading...',
    'size': 'Size',
  },
  bn: {
    // Navbar
    'nav.home': 'হোম',
    'nav.shop': 'শপ',

    // Hero
    'hero.fuel': 'আপনার',
    'hero.game': 'গেম চালান',
    'hero.subtitle': 'অরিজিনাল ASUS, HP, Dell, Lenovo এবং আরও অনেক কিছু। আপনার দরজায় ডেলিভারি।',
    'hero.shop_now': 'এখনই কিনুন',

    // Categories
    'categories.browse': 'ব্রাউজ করুন',
    'categories.title': 'ডিভাইস অনুযায়ী কিনুন',
    'categories.all': 'সব ক্যাটাগরি',
    'categories.products': 'পণ্য',

    // Trending
    'trending.label': 'এখন ট্রেন্ডিং',
    'trending.title': 'জনপ্রিয় পণ্য',
    'trending.view_all': 'সব দেখুন',

    // New Arrivals
    'new.label': 'নতুন এসেছে',
    'new.title': 'নতুন পণ্য',

    // Why Choose Us
    'why.label': 'Bright Beam এর বিশেষত্ব',
    'why.title': 'কেন আমাদের বেছে নেবেন',
    'why.authentic': '১০০% অরিজিনাল',
    'why.authentic_desc': 'প্রতিটি ল্যাপটপ যাচাই করা আসল। সরাসরি অথোরাইজড সোর্স থেকে আনি।',
    'why.performance': 'হাই পারফরম্যান্স',
    'why.performance_desc': 'Intel, AMD ও NVIDIA-এর সর্বশেষ প্রযুক্তির প্রসেসর ও গ্রাফিক্স।',
    'why.delivery': 'দ্রুত ডেলিভারি',
    'why.delivery_desc': 'সারা দেশে এক্সপ্রেস ডেলিভারি। একই দিনে ডেলিভারি সম্ভব।',
    'why.returns': 'সহজ রিটার্ন',
    'why.returns_desc': '৩০ দিনের ঝামেলামুক্ত রিটার্ন নীতি। কোনো প্রশ্ন নেই।',

    // Reviews
    'reviews.label': 'রিভিউ',
    'reviews.title': 'গ্রাহকরা কী বলছেন',

    // Newsletter
    'newsletter.label': 'আপডেট পান',
    'newsletter.title': 'এক্সক্লুসিভ অফার পান',
    'newsletter.subtitle': 'নতুন পণ্য ও বিশেষ ছাড়ের আর্লি অ্যাক্সেস পান।',
    'newsletter.placeholder': 'আপনার ইমেইল দিন',
    'newsletter.subscribe': 'সাবস্ক্রাইব করুন',

    // Shop Page
    'shop.collection': 'কালেকশন',
    'shop.all_products': 'সব পণ্য',
    'shop.search': 'ল্যাপটপ, ব্র্যান্ড খুঁজুন...',
    'shop.filters': 'ফিল্টার',
    'shop.categories': 'ক্যাটাগরি',
    'shop.brands': 'ব্র্যান্ড',
    'shop.all_brands': 'সব ব্র্যান্ড',
    'shop.price': 'মূল্য (RM)',
    'shop.products_found': 'টি পণ্য পাওয়া গেছে',
    'shop.loading': 'পণ্য লোড হচ্ছে...',
    'shop.no_results': 'কোনো ফলাফল নেই',
    'shop.adjust_filters': 'ফিল্টার পরিবর্তন করে দেখুন',

    // Product Page
    'product.reviews': 'রিভিউ',
    'product.in_stock': 'স্টকে আছে',
    'product.out_of_stock': 'স্টক শেষ',
    'product.select_size': 'সাইজ বেছে নিন',
    'product.color': 'রঙ',
    'product.add_to_cart': 'কার্টে যোগ করুন',
    'product.buy_now': 'অর্ডার করুন',
    'product.authentic': '১০০% অরিজিনাল - Bright Beam যাচাইকৃত',
    'product.free_delivery': 'সারা দেশে ফ্রি ডেলিভারি',
    'product.return_policy': '৩০ দিনের সহজ রিটার্ন নীতি',
    'product.cod': 'ক্যাশ অন ডেলিভারি সুবিধা আছে',
    'product.related': 'আরও পছন্দ করতে পারেন',
    'product.not_found': 'পণ্য পাওয়া যায়নি',
    'product.back_to_shop': 'শপে ফিরে যান',
    'product.select_size_error': 'অনুগ্রহ করে একটি সাইজ বেছে নিন',
    'product.select_color_error': 'অনুগ্রহ করে একটি রঙ বেছে নিন',
    'product.out_of_stock_error': 'এই ভ্যারিয়েশনটি স্টকে নেই',
    'product.added_to_cart': 'কার্টে যোগ হয়েছে!',

    // Cart Page
    'cart.title': 'আপনার কার্ট',
    'cart.empty': 'কার্ট খালি',
    'cart.empty_subtitle': 'আপনার টেক আপগ্রেড করার সময় এসেছে',
    'cart.order_summary': 'অর্ডার সারাংশ',
    'cart.subtotal': 'সাবটোটাল',
    'cart.shipping': 'শিপিং',
    'cart.free': 'বিনামূল্যে',
    'cart.total': 'মোট',
    'cart.checkout': 'চেকআউট করুন',
    'cart.cod_available': 'ক্যাশ অন ডেলিভারি সুবিধা আছে',

    // Checkout Page
    'checkout.title': 'চেকআউট',
    'checkout.back_to_cart': 'কার্টে ফিরে যান',
    'checkout.contact_info': 'যোগাযোগের তথ্য',
    'checkout.full_name': 'পূর্ণ নাম',
    'checkout.phone': 'ফোন',
    'checkout.email': 'ইমেইল',
    'checkout.shipping_address': 'শিপিং ঠিকানা',
    'checkout.area': 'এলাকা',
    'checkout.block': 'ব্লক',
    'checkout.street': 'রাস্তা ও ভবন',
    'checkout.notes': 'নোট',
    'checkout.delivery_instructions': 'ডেলিভারির নির্দেশনা...',
    'checkout.shipping_method': 'শিপিং পদ্ধতি',
    'checkout.no_shipping': 'কোনো শিপিং পদ্ধতি পাওয়া যায়নি',
    'checkout.payment_method': 'পেমেন্ট পদ্ধতি',
    'checkout.cod': 'ক্যাশ অন ডেলিভারি (COD)',
    'checkout.cod_desc': 'পণ্য পাওয়ার পর পেমেন্ট করুন',
    'checkout.place_order': 'অর্ডার দিন',
    'checkout.placing': 'অর্ডার দেওয়া হচ্ছে...',
    'checkout.order_confirmed': 'অর্ডার নিশ্চিত হয়েছে! 🎉',
    'checkout.order_placed': 'অর্ডার দেওয়া হয়েছে',
    'checkout.payment_cod': 'পেমেন্ট: ক্যাশ অন ডেলিভারি',
    'checkout.continue_shopping': 'কেনাকাটা চালিয়ে যান',
    'checkout.go_home': 'হোমে যান',
    'checkout.fill_required': 'অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন',
    'checkout.order_success': 'অর্ডার সফলভাবে দেওয়া হয়েছে!',
    'checkout.order_failed': 'অর্ডার দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',

    // Wishlist
    'wishlist.title': 'উইশলিস্ট',
    'wishlist.empty': 'কোনো সেভ করা আইটেম নেই',
    'wishlist.empty_subtitle': 'আপনার পছন্দের ডিভাইস এখানে সেভ করুন',
    'wishlist.browse': 'কালেকশন দেখুন',

    // Footer
    'footer.shop': 'শপ',
    'footer.company': 'কোম্পানি',
    'footer.about': 'আমাদের সম্পর্কে',
    'footer.contact': 'যোগাযোগ করুন',
    'footer.contact_title': 'যোগাযোগ',
    'footer.whatsapp': 'হোয়াটসঅ্যাপ',
    'footer.all_products': 'সব পণ্য',

    // Product Card
    'card.new': 'নতুন',
    'card.sale': 'সেল',

    // General
    'loading': 'লোড হচ্ছে...',
    'size': 'সাইজ',
  },
};
