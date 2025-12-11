import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  title: string;
  review_text: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  photo_urls?: string[];
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    loadReviews();
  }, [productId, sortBy]);

  const loadReviews = async () => {
    let query = supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true);

    if (sortBy === 'recent') query = query.order('created_at', { ascending: false });
    if (sortBy === 'helpful') query = query.order('helpful_count', { ascending: false });
    if (sortBy === 'rating') query = query.order('rating', { ascending: false });

    const { data } = await query;
    if (data) setReviews(data);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 3 - photos.length);
      setPhotos([...photos, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setUploading(true);

    // Upload photos to storage
    const photoUrls: string[] = [];
    for (const photo of photos) {
      const fileName = `${user.id}/${Date.now()}-${photo.name}`;
      const { data, error } = await supabase.storage
        .from('review-photos')
        .upload(fileName, photo);
      
      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('review-photos')
          .getPublicUrl(fileName);
        photoUrls.push(publicUrl);
      }
    }

    await supabase.from('product_reviews').insert({
      product_id: productId,
      user_id: user.id,
      customer_email: user.email,
      customer_name: user.user_metadata?.full_name || 'Anonymous',
      rating,
      title,
      review_text: reviewText,
      photo_urls: photoUrls,
      is_approved: false,
    });
    
    setUploading(false);
    setShowForm(false);
    setTitle('');
    setReviewText('');
    setPhotos([]);
    toast.success('Review submitted for approval!');
  };


  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= Math.round(Number(avgRating)) ? 'text-yellow-400' : 'text-slate-600'}>★</span>
              ))}
            </div>
            <span className="text-white font-semibold">{avgRating} out of 5</span>
            <span className="text-slate-400">({reviews.length} reviews)</span>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>Write a Review</Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Write Your Review</h3>
          <div className="space-y-4">
            <div>
              <label className="text-white mb-2 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-slate-600'}`}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <Input placeholder="Review title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Share your experience..." rows={4} value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
            
            <div>
              <label className="text-white mb-2 block">Add Photos (up to 3)</label>
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, idx) => (
                  <div key={idx} className="relative w-24 h-24">
                    <img src={URL.createObjectURL(photo)} className="w-full h-full object-cover rounded" />
                    <button onClick={() => removePhoto(idx)} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1">
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <label className="w-24 h-24 border-2 border-dashed border-slate-600 rounded flex items-center justify-center cursor-pointer hover:border-purple-500">
                    <Upload className="w-6 h-6 text-slate-400" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={uploading}>
                {uploading ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>

          </div>
        </Card>
      )}

      <div className="flex gap-2">
        <Button variant={sortBy === 'recent' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('recent')}>Most Recent</Button>
        <Button variant={sortBy === 'helpful' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('helpful')}>Most Helpful</Button>
        <Button variant={sortBy === 'rating' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('rating')}>Highest Rated</Button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-slate-800 border-slate-700 p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{review.customer_name}</span>
                  {review.is_verified_purchase && <Badge variant="outline" className="text-xs">Verified Purchase</Badge>}
                </div>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-slate-600'}>★</span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            <h4 className="font-semibold text-white mb-2">{review.title}</h4>
            <p className="text-slate-300">{review.review_text}</p>
            
            {review.photo_urls && review.photo_urls.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.photo_urls.map((url, idx) => (
                  <img key={idx} src={url} alt="Review" className="w-20 h-20 object-cover rounded" />
                ))}
              </div>
            )}
            
            <div className="mt-4 text-sm text-slate-400">
              {review.helpful_count} people found this helpful
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
}
