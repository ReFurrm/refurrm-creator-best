import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardNav from '@/components/DashboardNav';
import StudioUpload from '@/components/studio/StudioUpload';
import StudioQueue from '@/components/studio/StudioQueue';
import StudioPublished from '@/components/studio/StudioPublished';
import StudioMockups from '@/components/studio/StudioMockups';
import { Upload, Clock, CheckCircle, Sparkles, Shirt } from 'lucide-react';


export default function Studio() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="min-h-screen bg-[#EDDACE]">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-[#C24C1A]" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#C24C1A] to-[#1E8D70] bg-clip-text text-transparent">
              Creator Studio
            </h1>
          </div>
          <p className="text-xl text-[#5C4033] max-w-2xl mx-auto">
            Upload your idea. We do the rest.
          </p>
          <p className="text-[#8B7355] mt-2">
            Drop your art, notes, or rough drafts. AI turns them into polished products while you sleep.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 bg-[#1E8D70]/20">
            <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-[#C24C1A] data-[state=active]:text-white">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="mockups" className="flex items-center gap-2 data-[state=active]:bg-[#C24C1A] data-[state=active]:text-white">
              <Shirt className="w-4 h-4" />
              Mockups
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2 data-[state=active]:bg-[#C24C1A] data-[state=active]:text-white">
              <Clock className="w-4 h-4" />
              Processing
            </TabsTrigger>
            <TabsTrigger value="published" className="flex items-center gap-2 data-[state=active]:bg-[#C24C1A] data-[state=active]:text-white">
              <CheckCircle className="w-4 h-4" />
              Published
            </TabsTrigger>
          </TabsList>


          <TabsContent value="upload">
            <StudioUpload />
          </TabsContent>

          <TabsContent value="mockups">
            <StudioMockups />
          </TabsContent>

          <TabsContent value="processing">
            <StudioQueue />
          </TabsContent>

          <TabsContent value="published">
            <StudioPublished />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
