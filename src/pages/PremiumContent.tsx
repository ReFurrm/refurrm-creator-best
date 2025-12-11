import { ProtectedContent } from '@/components/ProtectedContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Video, FileText, Download } from 'lucide-react';

export default function PremiumContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Crown className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Premium Content</h1>
          <p className="text-gray-600">Exclusive resources for subscribers</p>
        </div>

        <ProtectedContent requireAnySubscription>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Masterclass Videos
                  </CardTitle>
                  <Badge className="bg-purple-600">Premium</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">Module 1: Foundation</h4>
                    <p className="text-sm text-gray-600">45 minutes</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">Module 2: Advanced Strategies</h4>
                    <p className="text-sm text-gray-600">60 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Exclusive Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Content Calendar Template</span>
                    <Download className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Email Sequence Pack</span>
                    <Download className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ProtectedContent>
      </div>
    </div>
  );
}
