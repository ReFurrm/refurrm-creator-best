import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import { CollectionEditor } from '@/components/CollectionEditor';

export default function Collections() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Please log in to manage collections.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <CollectionEditor />
        </div>
      </div>
    </div>
  );
}
