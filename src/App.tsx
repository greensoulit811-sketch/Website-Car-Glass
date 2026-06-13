import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { LanguageProvider } from "@/context/LanguageContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import FacebookPixelProvider from "@/components/FacebookPixelProvider";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import VisitorTracker from "@/components/VisitorTracker";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import WishlistPage from "./pages/WishlistPage.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import ProductsManager from "./pages/admin/ProductsManager.tsx";
import OrdersManager from "./pages/admin/OrdersManager.tsx";
import OrderDetailsPage from "./pages/admin/OrderDetailsPage.tsx";
import CouponsManager from "./pages/admin/CouponsManager.tsx";
import CheckoutLeadsManager from "./pages/admin/CheckoutLeadsManager.tsx";
import CategoriesManager from "./pages/admin/CategoriesManager.tsx";
import BannersManager from "./pages/admin/BannersManager.tsx";
import AnalyticsPage from "./pages/admin/AnalyticsPage.tsx";
import VisitorAnalyticsPage from "./pages/admin/VisitorAnalyticsPage.tsx";
import ShippingMethodsManager from "./pages/admin/ShippingMethodsManager.tsx";
import ReviewsManager from "./pages/admin/ReviewsManager.tsx";
import CustomersPage from "./pages/admin/CustomersPage.tsx";
import SettingsPage from "./pages/admin/SettingsPage.tsx";
import MarketingTrackingPage from "./pages/admin/MarketingTrackingPage.tsx";
import PagesManager from "./pages/admin/PagesManager.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import QuotationPage from "./pages/QuotationPage.tsx";
import QuotationsManager from "./pages/admin/QuotationsManager.tsx";
import PricelistPage from "./pages/PricelistPage.tsx";
import WhyChooseUsManager from "./pages/admin/WhyChooseUsManager.tsx";
import TestimonialManager from "./pages/admin/TestimonialManager.tsx";
import ContactLeadsManager from "./pages/admin/ContactLeadsManager.tsx";
import AppointmentsManager from "./pages/admin/AppointmentsManager.tsx";
import AppointmentPage from "./pages/AppointmentPage.tsx";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <AdminAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LanguageProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/appointment" element={<AppointmentPage />} />
              <Route path="/quotation" element={<QuotationPage />} />
              <Route path="/pricelist" element={<PricelistPage />} />


              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductsManager />} />
                <Route path="orders" element={<OrdersManager />} />
                <Route path="orders/:id" element={<OrderDetailsPage />} />
                <Route path="categories" element={<CategoriesManager />} />
                <Route path="coupons" element={<CouponsManager />} />
                <Route path="checkout-leads" element={<CheckoutLeadsManager />} />
                <Route path="banners" element={<BannersManager />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="visitor-analytics" element={<VisitorAnalyticsPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="marketing" element={<MarketingTrackingPage />} />
                <Route path="shipping" element={<ShippingMethodsManager />} />
                <Route path="reviews" element={<ReviewsManager />} />
                <Route path="quotations" element={<QuotationsManager />} />
                <Route path="why-choose-us" element={<WhyChooseUsManager />} />
                <Route path="testimonials" element={<TestimonialManager />} />
                <Route path="contact-messages" element={<ContactLeadsManager />} />
                <Route path="appointments" element={<AppointmentsManager />} />
                <Route path="pages" element={<PagesManager />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <VisitorTracker />
            <WhatsAppButton />
            <FacebookPixelProvider />
            </LanguageProvider>
          </BrowserRouter>
        </AdminAuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
