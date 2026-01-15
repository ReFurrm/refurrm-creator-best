import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
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
import SupportAdmin from '@/pages/SupportAdmin';
import NotFound from '@/pages/NotFound';


import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppProvider>
          <Router>
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

              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CustomerSupport />
            <Toaster />
            <SpeedInsights />

          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
