import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import ArtistCampaignGen from '@/components/ArtistCampaignGen';
import VoiceToStore from '@/components/VoiceToStore';

export default function AppLayout() {
  const [activeDemo, setActiveDemo] = useState<'artist' | 'visionary' | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = (type: 'artist' | 'visionary') => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActiveDemo(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900">
      {/* Nav */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ReFurrm
          </div>
          <div className="flex gap-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-white hover:text-purple-300">Dashboard</Button>
                </Link>
                <Link to="/profile">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-purple-300">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold">
                    Start FREE Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764029683081_16a48bae.webp" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-blue-900/50 to-slate-900"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full">
            <span className="text-purple-300 font-semibold">Launch Your Empire in Minutes, Not Months</span>
          </div>
          <h1 className="text-7xl font-black text-white mb-6 leading-tight">
            Stop Building.<br/>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Start SELLING.
            </span>
          </h1>
          <p className="text-3xl text-purple-200 mb-4 font-bold">
            Your art deserves an audience. Your ideas deserve revenue.
          </p>
          <p className="text-xl text-blue-200 mb-10">
            We handle the boring stuff. You handle the genius.
          </p>
          <div className="flex gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleDemoClick('artist')} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-6 shadow-2xl shadow-purple-500/50"
            >
              🎨 I'm An Artist
            </Button>
            <Button 
              size="lg" 
              onClick={() => handleDemoClick('visionary')} 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg px-8 py-6 shadow-2xl shadow-blue-500/50"
            >
              💡 I Have Ideas
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 p-8 text-center">
            <div className="text-5xl font-black text-purple-300 mb-2">3 MIN</div>
            <div className="text-xl text-white font-semibold">From Idea to Live Store</div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 p-8 text-center">
            <div className="text-5xl font-black text-blue-300 mb-2">ZERO</div>
            <div className="text-xl text-white font-semibold">Coding Required</div>
          </Card>
          <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/30 p-8 text-center">
            <div className="text-5xl font-black text-pink-300 mb-2">100%</div>
            <div className="text-xl text-white font-semibold">You Keep the Profits</div>
          </Card>
        </div>
      </section>

      {/* Problem */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-white mb-6">
            We're Not a Store Builder.<br/>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              We're Your Unfair Advantage.
            </span>
          </h2>
          <p className="text-2xl text-purple-200">
            Stop wasting time on tech. Start making money from your talent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 p-10 hover:shadow-2xl hover:shadow-purple-500/30 transition-all">
            <div className="h-56 rounded-xl mb-6 overflow-hidden">
              <img src="https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764029684063_ba69ff7b.webp" alt="Artist" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">For Artists</h3>
            <p className="text-purple-200 mb-6 text-lg">
              You create. We handle EVERYTHING else.
            </p>
            <div className="bg-purple-500/20 border border-purple-400/30 p-6 rounded-xl mb-6">
              <p className="font-bold text-purple-300 mb-3 text-lg">Upload Once. Sell Everywhere.</p>
              <p className="text-white">
                AI instantly creates product pages, social posts, email campaigns, and more. 
                <span className="text-purple-300 font-bold"> 1 upload = 3 hours saved.</span>
              </p>
            </div>
            <Button 
              onClick={() => handleDemoClick('artist')} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6"
            >
              Try It FREE Now
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30 p-10 hover:shadow-2xl hover:shadow-blue-500/30 transition-all">
            <div className="h-56 rounded-xl mb-6 overflow-hidden">
              <img src="https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764029685035_68b9ccb5.webp" alt="Visionary" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">For Visionaries</h3>
            <p className="text-blue-200 mb-6 text-lg">
              Got an idea? We'll build it while you sleep.
            </p>
            <div className="bg-blue-500/20 border border-blue-400/30 p-6 rounded-xl mb-6">
              <p className="font-bold text-blue-300 mb-3 text-lg">Talk. We Build.</p>
              <p className="text-white">
                Voice note your idea. AI creates landing pages, sales copy, and lead magnets. 
                <span className="text-blue-300 font-bold"> Shower thought = live store.</span>
              </p>
            </div>
            <Button 
              onClick={() => handleDemoClick('visionary')} 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg py-6"
            >
              Try It FREE Now
            </Button>
          </Card>
        </div>
      </section>

      {/* Demo */}
      {activeDemo && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <Card className="bg-slate-900/80 border-purple-500/30 p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-black text-white">
                {activeDemo === 'artist' ? '🎨 Artist Campaign Generator' : '💡 Voice-to-Store Builder'}
              </h2>
              <Button variant="ghost" onClick={() => setActiveDemo(null)} className="text-white hover:text-purple-300">
                Close
              </Button>
            </div>
            {activeDemo === 'artist' ? <ArtistCampaignGen /> : <VoiceToStore />}
          </Card>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-sm border-t border-purple-500/20 text-white py-16 mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-300">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/billing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/integrations" className="text-slate-300 hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-300">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Docs</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-pink-300">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-cyan-300">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-8 text-center">
            <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Stop Building. Start ReFurrming.
            </p>
            <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} ReFurrm. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
