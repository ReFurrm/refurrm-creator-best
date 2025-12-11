import { useState, useEffect } from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatWindow } from '@/components/ChatWindow';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface Conversation {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  created_at: string;
  unread_count?: number;
}

export default function SupportAdmin() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);

  useEffect(() => {
    loadConversations();
    const channel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, loadConversations)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, loadConversations)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadConversations = async () => {
    const { data } = await supabase.from('conversations').select('*').order('updated_at', { ascending: false });
    if (data) setConversations(data);
  };

  const closeConversation = async (id: string) => {
    await supabase.from('conversations').update({ status: 'closed' }).eq('id', id);
    loadConversations();
    if (selectedConv?.id === id) setSelectedConv(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Support Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`p-3 rounded-lg cursor-pointer border ${selectedConv?.id === conv.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{conv.customer_name}</p>
                    <p className="text-xs text-gray-500">{conv.customer_email}</p>
                  </div>
                  <Badge variant={conv.status === 'open' ? 'default' : 'secondary'}>{conv.status}</Badge>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {new Date(conv.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedConv ? (
            <>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedConv.customer_name}</CardTitle>
                  <p className="text-sm text-gray-500">{selectedConv.customer_email}</p>
                </div>
                {selectedConv.status === 'open' && (
                  <Button variant="outline" onClick={() => closeConversation(selectedConv.id)}>Close</Button>
                )}
              </CardHeader>
              <CardContent className="h-[500px]">
                <ChatWindow conversationId={selectedConv.id} senderType="owner" senderName="Support Team" />
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-[600px] text-gray-400">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
