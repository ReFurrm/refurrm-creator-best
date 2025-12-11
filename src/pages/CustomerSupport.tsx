import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChatWindow } from '@/components/ChatWindow';
import { supabase } from '@/lib/supabase';

export default function CustomerSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('chat_conversation_id');
    if (stored) {
      setConversationId(stored);
      setShowForm(false);
    }
  }, []);

  const startConversation = async () => {
    if (!customerName.trim() || !customerEmail.trim()) return;
    
    const { data, error } = await supabase
      .from('conversations')
      .insert({ customer_name: customerName, customer_email: customerEmail })
      .select()
      .single();

    if (data) {
      setConversationId(data.id);
      localStorage.setItem('chat_conversation_id', data.id);
      localStorage.setItem('chat_customer_name', customerName);
      localStorage.setItem('chat_customer_email', customerEmail);
      setShowForm(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
            <h3 className="font-semibold">Customer Support</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-700">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {showForm ? (
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Start a conversation with our support team</p>
              <Input placeholder="Your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <Input placeholder="Your email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
              <Button onClick={startConversation} className="w-full">Start Chat</Button>
            </div>
          ) : conversationId ? (
            <ChatWindow conversationId={conversationId} senderType="customer" senderName={localStorage.getItem('chat_customer_name') || 'Customer'} />
          ) : null}
        </Card>
      )}
    </>
  );
}
