import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import DashboardNav from '@/components/DashboardNav';

interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string;
  review_text: string;
  is_approved: boolean;
  admin_response: string | null;
  created_at: string;
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [response, setResponse] = useState('');

  const loadReviews = useCallback(async () => {
    let query = supabase.from('product_reviews').select('*').order('created_at', { ascending: false });
    if (filter === 'pending') query = query.eq('is_approved', false);
    if (filter === 'approved') query = query.eq('is_approved', true);
    const { data } = await query;
    if (data) setReviews(data);
  }, [filter]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleApprove = async (id: string) => {
    await supabase.from('product_reviews').update({ is_approved: true }).eq('id', id);
    loadReviews();
  };

  const handleReject = async (id: string) => {
    await supabase.from('product_reviews').delete().eq('id', id);
    loadReviews();
  };

  const handleRespond = async () => {
    if (!selectedReview) return;
    await supabase.from('product_reviews').update({ admin_response: response, admin_response_date: new Date().toISOString() }).eq('id', selectedReview.id);
    setSelectedReview(null);
    setResponse('');
    loadReviews();
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-black text-white mb-8">Reviews Manager</h1>

        <div className="flex gap-2 mb-6">
          <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>
            Pending ({reviews.filter(r => !r.is_approved).length})
          </Button>
          <Button variant={filter === 'approved' ? 'default' : 'outline'} onClick={() => setFilter('approved')}>Approved</Button>
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="bg-slate-800 border-slate-700 p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-white">{review.customer_name}</span>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-slate-600'}>★</span>
                      ))}
                    </div>
                  </div>
                  <Badge variant={review.is_approved ? 'default' : 'secondary'}>{review.is_approved ? 'Approved' : 'Pending'}</Badge>
                </div>
                <h4 className="font-semibold text-white mb-2">{review.title}</h4>
                <p className="text-slate-300 mb-4">{review.review_text}</p>
                <div className="flex gap-2">
                  {!review.is_approved && <Button size="sm" onClick={() => handleApprove(review.id)}>Approve</Button>}
                  <Button size="sm" variant="outline" onClick={() => setSelectedReview(review)}>Respond</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(review.id)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>

          {selectedReview && (
            <Card className="bg-slate-800 border-slate-700 p-6 h-fit sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">Respond to Review</h3>
              <div className="space-y-4">
                <div className="bg-slate-700 p-4 rounded">
                  <p className="text-white font-semibold">{selectedReview.title}</p>
                  <p className="text-slate-300 text-sm mt-2">{selectedReview.review_text}</p>
                </div>
                <Textarea placeholder="Your response..." rows={6} value={response} onChange={(e) => setResponse(e.target.value)} />
                <div className="flex gap-2">
                  <Button onClick={handleRespond}>Send Response</Button>
                  <Button variant="outline" onClick={() => setSelectedReview(null)}>Cancel</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
