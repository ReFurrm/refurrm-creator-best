import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender_type: 'customer' | 'owner';
  sender_name: string;
  message_text?: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
}

interface ChatWindowProps {
  conversationId: string;
  senderType: 'customer' | 'owner';
  senderName: string;
}

export function ChatWindow({ conversationId, senderType, senderName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMessages = useCallback(async () => {
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at');
    if (data) setMessages(data);
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() && !file) return;
    setSending(true);
    let fileUrl = null, fileName = null;

    if (file) {
      const path = `${conversationId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('chat-attachments').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('chat-attachments').getPublicUrl(path);
        fileUrl = data.publicUrl;
        fileName = file.name;
      }
    }

    await supabase.from('messages').insert({ conversation_id: conversationId, sender_type: senderType, sender_name: senderName, message_text: newMessage || null, file_url: fileUrl, file_name: fileName });
    setNewMessage('');
    setFile(null);
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => <ChatMessage key={msg.id} {...msg} />)}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        {file && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-gray-100 rounded">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm flex-1">{file.name}</span>
            <Button variant="ghost" size="sm" onClick={() => setFile(null)}><X className="h-4 w-4" /></Button>
          </div>
        )}
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="h-4 w-4" /></Button>
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." />
          <Button onClick={handleSend} disabled={sending}><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
