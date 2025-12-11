import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Package, Calendar, BarChart3, 
  MessageSquare, Mail, Settings, CreditCard, 
  LogOut, Store, Plug, User, Crown, AlertTriangle, Headphones, Shield, Users, Layers
} from 'lucide-react';



import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function DashboardNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    if (user) {
      loadVipStatus();
    }
  }, [user]);

  const loadVipStatus = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('is_vip')
      .eq('user_id', user?.id)
      .single();

    if (data?.is_vip) {
      setIsVip(true);
    }
  };




  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/studio', label: 'Studio', icon: Store },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/collections', label: 'Collections', icon: Layers },
    { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/orders', label: 'Orders', icon: Calendar },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/emails', label: 'Emails', icon: Mail },
  ];





  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-purple-600">ReFurrm Shops</h1>
              {isVip && (
                <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">
                  VIP
                </span>
              )}
            </Link>



            <div className="hidden md:flex space-x-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive(item.path)
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/premium">
              <Button variant="outline" size="sm" className="border-purple-600 text-purple-600">
                <Crown className="w-4 h-4 mr-2" />
                Premium
              </Button>
            </Link>

            <Link to="/shop/demo" target="_blank">
              <Button variant="outline" size="sm">
                <Store className="w-4 h-4 mr-2" />
                View Store
              </Button>
            </Link>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/billing')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dunning')}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Dunning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/support-admin')}>
                  <Headphones className="mr-2 h-4 w-4" />
                  Support Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </DropdownMenuItem>




                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}