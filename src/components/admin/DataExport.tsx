import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Database, FileJson, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DataExport() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const exportData = async (format: 'csv' | 'json') => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('export-data', {
      body: { format }
    });
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      const blob = new Blob([data.content], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-export-${Date.now()}.${format}`;
      a.click();
      toast({ title: 'Success', description: 'Data exported successfully' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Export All Data
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Download all your products, customers, orders, and analytics data
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={() => exportData('csv')} disabled={loading} variant="outline" className="h-24">
            <div className="flex flex-col items-center gap-2">
              <FileSpreadsheet className="h-8 w-8" />
              <span>Export as CSV</span>
            </div>
          </Button>
          <Button onClick={() => exportData('json')} disabled={loading} variant="outline" className="h-24">
            <div className="flex flex-col items-center gap-2">
              <FileJson className="h-8 w-8" />
              <span>Export as JSON</span>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  );
}
