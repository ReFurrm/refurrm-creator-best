import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';


export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, subscribed_at: new Date().toISOString() });
    
    if (error) {
      toast.error('Subscription failed. Please try again.');
    } else {
      setSubscribed(true);
      setEmail('');
      toast.success('Successfully subscribed to newsletter!');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };


  return (
    <footer className="bg-[#1E8D70]/20 backdrop-blur-sm border-t border-[#C24C1A]/30 py-16 mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-black bg-gradient-to-r from-[#C24C1A] to-[#8FCBCD] bg-clip-text text-transparent mb-4">
              ReFurrm Ai Studio
            </h3>
            <p className="text-[#5C4033] mb-6">
              Stop building. Start selling. We handle the boring stuff so you can focus on your genius.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#5C4033] hover:text-[#C24C1A] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z"/></svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#C24C1A]">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/pricing" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">Pricing</Link></li>
              <li><Link to="/about" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">About</Link></li>
              <li><Link to="/affiliates" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">Affiliates</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#8FCBCD]">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">Privacy</Link></li>
              <li><Link to="/ccpa" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">CCPA</Link></li>
              <li><Link to="/dpa" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">DPA</Link></li>
              <li><Link to="/refund" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">Refund Policy</Link></li>
              <li><Link to="/aup" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">AUP</Link></li>
              <li><Link to="/eula" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">EULA</Link></li>
              <li><Link to="/cookie-policy" className="text-[#5C4033] hover:text-[#1E8D70] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#1E8D70]">Stay Updated</h4>
            <p className="text-[#5C4033] text-sm mb-4">Get tips, updates, and exclusive offers.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#EDDACE]/50 border-[#C24C1A]/30 text-[#5C4033] placeholder:text-[#8B7355]"
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-[#C24C1A] to-[#1E8D70] hover:from-[#A63D14] hover:to-[#177560]">
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#C24C1A]/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#8B7355] text-sm">
              &copy; {new Date().getFullYear()} ReFurrm Ai Studio. All rights reserved.
            </p>
            <p className="text-[#8B7355] text-sm">
              Contact: support@refurrm.app | 479.446.6201
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
