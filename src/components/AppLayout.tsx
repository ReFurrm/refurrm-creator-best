import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import CartIcon from '@/components/CartIcon';
import ArtistCampaignGen from '@/components/ArtistCampaignGen';
import VoiceToStore from '@/components/VoiceToStore';
import Footer from '@/components/Footer';

export default function AppLayout() {
  const [activeDemo, setActiveDemo] = useState<'artist' | 'creator' | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = (type: 'artist' | 'creator') => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActiveDemo(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-black text-purple-600">ReFurrm</div>
          <div className="flex gap-4 items-center">
            <Link to="/pricing"><Button variant="ghost">Pricing</Button></Link>
            <Link to="/about"><Button variant="ghost">About</Button></Link>
            <CartIcon />
            {user ? (
              <Link to="/dashboard"><Button className="bg-purple-600">Dashboard</Button></Link>
            ) : (
              <Link to="/signup"><Button className="bg-purple-600">Start Free</Button></Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full">
          <span className="text-purple-700 font-semibold">Launch Your Empire in Minutes, Not Months</span>
        </div>
        <h1 className="text-6xl font-black text-slate-900 mb-6">Skip the busywork.<br/>Start selling.</h1>
        <p className="text-2xl text-slate-700 mb-8 max-w-4xl mx-auto">
          You create. We handle setup, production, listings, marketing, and fulfillment.<br/>
          <span className="text-purple-600 font-bold">You keep full creative control, copyright, and 100% of the profits.</span><br/>
          Assistants help only when you ask. Choose how much help you want at any time.
        </p>
        <div className="flex gap-4 justify-center mb-4">
          <Button onClick={() => handleDemoClick('artist')} size="lg" className="bg-purple-600 text-lg px-8">I'm an Artist</Button>
          <Button onClick={() => handleDemoClick('creator')} size="lg" variant="outline" className="text-lg px-8">I'm a Creator</Button>
        </div>
        <div className="flex gap-6 justify-center mt-8">
          <Link to="/signup"><Button size="lg" className="bg-slate-900">Try Free — Creator Controlled</Button></Link>
          <Link to="/onboarding"><Button size="lg" variant="outline">Book Guided Setup</Button></Link>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-black text-center mb-4">Three Simple Steps<br/><span className="text-purple-600">You Stay in Control</span></h2>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card className="p-8 text-center">
            <div className="text-5xl font-black text-purple-600 mb-4">1</div>
            <h3 className="text-xl font-bold mb-3">Upload your art or record your idea</h3>
            <p className="text-slate-600">Start with what you have. No technical skills needed.</p>
          </Card>
          <Card className="p-8 text-center">
            <div className="text-5xl font-black text-purple-600 mb-4">2</div>
            <h3 className="text-xl font-bold mb-3">Assistants generate drafts when you request</h3>
            <p className="text-slate-600">Product mockups, listings, social posts, and promo materials—only when you ask.</p>
          </Card>
          <Card className="p-8 text-center">
            <div className="text-5xl font-black text-purple-600 mb-4">3</div>
            <h3 className="text-xl font-bold mb-3">You review, edit, and approve everything</h3>
            <p className="text-slate-600">Nothing goes live without your approval. You're always in control.</p>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12">Key Benefits</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-3">Save Time, Not Control</h3>
              <p className="text-purple-100">Upload once and get ready-to-review drafts that cut setup and marketing time by hours.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Creator Owned</h3>
              <p className="text-purple-100">You keep copyright, pricing authority, and final approval on every listing.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Flexible Help</h3>
              <p className="text-purple-100">Turn automation on or off per task. Request full guided setup or do everything yourself.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Sell Everywhere</h3>
              <p className="text-purple-100">One upload produces mockups, variants, and publishable drafts for multiple channels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-black mb-8">Trust and Proof</h2>
        <div className="space-y-4 text-lg text-slate-700">
          <p><strong>Manual review is the default.</strong> Nothing goes live without your approval.</p>
          <p>Trusted by creators who keep 100% of their profits.</p>
          <p>Secure payments and transparent fees. <Link to="/terms" className="text-purple-600 underline">See our Creator Rights</Link> for details.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12">What Creators Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <p className="text-lg mb-4">"ReFurrm trimmed my setup time from days to hours and I still approve every listing. I'm in full control."</p>
              <p className="font-bold">— Mara L, Illustrator</p>
            </Card>
            <Card className="p-8">
              <p className="text-lg mb-4">"I recorded an idea in the morning and had a draft landing page to edit by lunch. Assistants only did what I asked."</p>
              <p className="font-bold">— Jonah R, Product Designer</p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-black text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-2">Who owns my art?</h3>
            <p className="text-slate-600">You do. ReFurrm does not claim ownership of your work.</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-2">Will assistants publish without me?</h3>
            <p className="text-slate-600">No. Drafts are created on request and nothing is published without your approval by default.</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-2">How much help can I get?</h3>
            <p className="text-slate-600">As much or as little as you want. Use per-task automation, request full guided setup, or do everything manually.</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-2">Can I change settings later?</h3>
            <p className="text-slate-600">Yes. Adjust your automation and approval preferences at any time.</p>
          </Card>
        </div>
      </section>

      {/* Demo */}
      {activeDemo && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <Card className="p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black">{activeDemo === 'artist' ? 'Artist Campaign Generator' : 'Creator Voice-to-Store'}</h2>
              <Button variant="ghost" onClick={() => setActiveDemo(null)}>Close</Button>
            </div>
            {activeDemo === 'artist' ? <ArtistCampaignGen /> : <VoiceToStore />}
          </Card>
        </section>
      )}

      <Footer />
    </div>
  );
}
