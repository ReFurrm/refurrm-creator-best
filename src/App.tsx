import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { AppProvider } from '@/contexts/AppContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';

import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import ProductForm from '@/pages/ProductForm';
import Storefront from '@/pages/Storefront';
import Checkout from '@/pages/Checkout';
import Inventory from '@/pages/Inventory';
import Orders from '@/pages/Orders';

import Success from '@/pages/Success';
import Onboarding from '@/pages/Onboarding';
import Emails from '@/pages/Emails';
import DMCampaigns from '@/pages/DMCampaigns';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import Integrations from '@/pages/Integrations';
import Bookings from '@/pages/Bookings';
import Billing from '@/pages/Billing';
import Subscriptions from '@/pages/Subscriptions';
import PremiumContent from '@/pages/PremiumContent';
import Dunning from '@/pages/Dunning';
import Profile from '@/pages/Profile';
import CustomerSupport from '@/pages/CustomerSupport';
import SupportAdmin from '@/pages/SupportAdmin';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';
import Pricing from '@/pages/Pricing';
import VIPManager from '@/pages/VIPManager';
import OnboardingAnalytics from '@/pages/OnboardingAnalytics';
import Affiliates from '@/pages/Affiliates';
import AffiliateDashboard from '@/pages/AffiliateDashboard';
import AffiliateSignup from '@/pages/AffiliateSignup';
import Health from '@/pages/Health';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import CCPA from '@/pages/CCPA';
import DPA from '@/pages/DPA';
import Refund from '@/pages/Refund';
import AUP from '@/pages/AUP';
import About from '@/pages/About';
import EULA from '@/pages/EULA';
import CommunityGuidelines from '@/pages/CommunityGuidelines';
import MerchantGuidelines from '@/pages/MerchantGuidelines';
import AIOutputSafety from '@/pages/AIOutputSafety';
import BetaTesterAgreement from '@/pages/BetaTesterAgreement';
import CookiePolicy from '@/pages/CookiePolicy';
import EmailTemplates from '@/pages/EmailTemplates';
import Blog from '@/pages/Blog';
import BlogAdmin from '@/pages/BlogAdmin';
import ReviewsManager from '@/pages/ReviewsManager';
import ReviewsAnalytics from '@/pages/ReviewsAnalytics';
import EmailCampaigns from '@/pages/EmailCampaigns';
import StoreBuilder from '@/pages/StoreBuilder';
import Studio from '@/pages/Studio';
import Collections from '@/pages/Collections';
import CollectionStorefront from '@/pages/CollectionStorefront';
import SocialMediaAnalytics from '@/pages/SocialMediaAnalytics';
import CreatorRights from '@/pages/CreatorRights';




import './App.css';



function App() {
  console.log('🚀 App: Starting application...');
  
  return (
    <ErrorBoundary>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <CartProvider>
          <AppProvider>

          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/health" element={<Health />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/shop/:username" element={<Storefront />} />
              <Route path="/collection/:slug" element={<CollectionStorefront />} />
              <Route path="/checkout/:productId" element={<Checkout />} />
              <Route path="/success" element={<Success />} />

              <Route path="/affiliate-signup" element={<AffiliateSignup />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/ccpa" element={<CCPA />} />
              <Route path="/dpa" element={<DPA />} />

              <Route path="/refund" element={<Refund />} />
              <Route path="/aup" element={<AUP />} />
              <Route path="/about" element={<About />} />
              <Route path="/eula" element={<EULA />} />
              <Route path="/community-guidelines" element={<CommunityGuidelines />} />
              <Route path="/merchant-guidelines" element={<MerchantGuidelines />} />
              <Route path="/ai-output-safety" element={<AIOutputSafety />} />
              <Route path="/beta-tester-agreement" element={<BetaTesterAgreement />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/creator-rights" element={<CreatorRights />} />
              <Route path="/blog" element={<Blog />} />



              
              {/* Protected routes */}
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
              <Route path="/products/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
              <Route path="/products/:id/edit" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
              <Route path="/storefront" element={<ProtectedRoute><Storefront /></ProtectedRoute>} />
              <Route path="/store-builder" element={<ProtectedRoute><StoreBuilder /></ProtectedRoute>} />
              <Route path="/studio" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
              <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />


              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/checkout" element={<Checkout />} />


              <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
              <Route path="/premium" element={<ProtectedRoute><PremiumContent /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/dm-campaigns" element={<ProtectedRoute><DMCampaigns /></ProtectedRoute>} />
              <Route path="/emails" element={<ProtectedRoute><Emails /></ProtectedRoute>} />
              <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              <Route path="/dunning" element={<ProtectedRoute><Dunning /></ProtectedRoute>} />
              <Route path="/support-admin" element={<ProtectedRoute><SupportAdmin /></ProtectedRoute>} />
              <Route path="/vip-manager" element={<ProtectedRoute><VIPManager /></ProtectedRoute>} />
              <Route path="/affiliates" element={<ProtectedRoute><Affiliates /></ProtectedRoute>} />
              <Route path="/affiliate-dashboard" element={<ProtectedRoute><AffiliateDashboard /></ProtectedRoute>} />
              <Route path="/email-templates" element={<ProtectedRoute><EmailTemplates /></ProtectedRoute>} />
              <Route path="/reviews-manager" element={<ProtectedRoute><ReviewsManager /></ProtectedRoute>} />
              <Route path="/reviews-analytics" element={<ProtectedRoute><ReviewsAnalytics /></ProtectedRoute>} />
              <Route path="/email-campaigns" element={<ProtectedRoute><EmailCampaigns /></ProtectedRoute>} />
              <Route path="/social-analytics" element={<ProtectedRoute><SocialMediaAnalytics /></ProtectedRoute>} />





              
              
              {/* Admin routes */}
              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/blog/admin" element={<AdminRoute><BlogAdmin /></AdminRoute>} />
              <Route path="/onboarding-analytics" element={<AdminRoute><OnboardingAnalytics /></AdminRoute>} />




              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CustomerSupport />
            <Toaster />
          </Router>
          </AppProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
