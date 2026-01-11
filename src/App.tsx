import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';

import './App.css';

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Lazy load all page components
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import ProductForm from '@/pages/ProductForm';
import Storefront from '@/pages/Storefront';
import Checkout from '@/pages/Checkout';
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
import NotFound from '@/pages/NotFound';


import './App.css';

function App() {

import './App.css';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Products = lazy(() => import('@/pages/Products'));
const ProductForm = lazy(() => import('@/pages/ProductForm'));
const Storefront = lazy(() => import('@/pages/Storefront'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const Orders = lazy(() => import('@/pages/Orders'));
const Success = lazy(() => import('@/pages/Success'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Emails = lazy(() => import('@/pages/Emails'));
const DMCampaigns = lazy(() => import('@/pages/DMCampaigns'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Settings = lazy(() => import('@/pages/Settings'));
const Integrations = lazy(() => import('@/pages/Integrations'));
const Bookings = lazy(() => import('@/pages/Bookings'));
const Billing = lazy(() => import('@/pages/Billing'));
const Subscriptions = lazy(() => import('@/pages/Subscriptions'));
const PremiumContent = lazy(() => import('@/pages/PremiumContent'));
const Dunning = lazy(() => import('@/pages/Dunning'));
const Profile = lazy(() => import('@/pages/Profile'));
const CustomerSupport = lazy(() => import('@/pages/CustomerSupport'));
const SupportAdmin = lazy(() => import('@/pages/SupportAdmin'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const SupportAdmin = lazy(() => import('@/pages/SupportAdmin'));
const Admin = lazy(() => import('@/pages/Admin'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const VIPManager = lazy(() => import('@/pages/VIPManager'));
const OnboardingAnalytics = lazy(() => import('@/pages/OnboardingAnalytics'));
const Affiliates = lazy(() => import('@/pages/Affiliates'));
const AffiliateDashboard = lazy(() => import('@/pages/AffiliateDashboard'));
const AffiliateSignup = lazy(() => import('@/pages/AffiliateSignup'));
const Health = lazy(() => import('@/pages/Health'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const CCPA = lazy(() => import('@/pages/CCPA'));
const DPA = lazy(() => import('@/pages/DPA'));
const Refund = lazy(() => import('@/pages/Refund'));
const AUP = lazy(() => import('@/pages/AUP'));
const About = lazy(() => import('@/pages/About'));
const EULA = lazy(() => import('@/pages/EULA'));
const CommunityGuidelines = lazy(() => import('@/pages/CommunityGuidelines'));
const MerchantGuidelines = lazy(() => import('@/pages/MerchantGuidelines'));
const AIOutputSafety = lazy(() => import('@/pages/AIOutputSafety'));
const BetaTesterAgreement = lazy(() => import('@/pages/BetaTesterAgreement'));
const CookiePolicy = lazy(() => import('@/pages/CookiePolicy'));
const EmailTemplates = lazy(() => import('@/pages/EmailTemplates'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogAdmin = lazy(() => import('@/pages/BlogAdmin'));
const ReviewsManager = lazy(() => import('@/pages/ReviewsManager'));
const ReviewsAnalytics = lazy(() => import('@/pages/ReviewsAnalytics'));
const EmailCampaigns = lazy(() => import('@/pages/EmailCampaigns'));
const StoreBuilder = lazy(() => import('@/pages/StoreBuilder'));
const Studio = lazy(() => import('@/pages/Studio'));
const Collections = lazy(() => import('@/pages/Collections'));
const CollectionStorefront = lazy(() => import('@/pages/CollectionStorefront'));
const SocialMediaAnalytics = lazy(() => import('@/pages/SocialMediaAnalytics'));
const CreatorRights = lazy(() => import('@/pages/CreatorRights'));


const Community = lazy(() => import('@/pages/Community'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
    Loading...
  </div>
);

function App() {
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
            <Routes>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/shop/:username" element={<Storefront />} />
              <Route path="/checkout/:productId" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              
              {/* Protected routes */}
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
              <Route path="/products/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
              <Route path="/products/:id/edit" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
              <Route path="/storefront" element={<ProtectedRoute><Storefront /></ProtectedRoute>} />
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
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />





              
              
              {/* Admin routes */}
              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/blog/admin" element={<AdminRoute><BlogAdmin /></AdminRoute>} />
              <Route path="/onboarding-analytics" element={<AdminRoute><OnboardingAnalytics /></AdminRoute>} />




              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
              </Routes>
            </Suspense>
            <CustomerSupport />
            <Toaster />

          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
