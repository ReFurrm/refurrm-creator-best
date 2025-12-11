import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function AIOutputSafety() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          ← Back to Home
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <div>
                <CardTitle className="text-3xl">AI Output Safety Notice</CardTitle>
                <p className="text-muted-foreground mt-1">Important information about AI-generated content</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="font-semibold text-orange-900">
                AI can generate unexpected or incorrect content. By using ReFURRM Ai Studio, you acknowledge:
              </p>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <span>AI output may be inaccurate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <span>AI output may require editing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <span>AI does not guarantee originality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <span>You are responsible for verifying your content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <span>We are not liable for errors in AI output</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <span>You must ensure compliance with copyright and safety laws</span>
              </li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="font-semibold text-blue-900">
                Always review, edit, and verify AI-generated content before publishing or selling.
              </p>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Contact: <a href="mailto:support@refurrm.app" className="text-blue-600 hover:underline">support@refurrm.app</a> | 
                Phone: 479.446.6201
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
