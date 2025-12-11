import { Download } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessageProps {
  senderType: 'customer' | 'owner';
  senderName: string;
  messageText?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

export function ChatMessage({ senderType, senderName, messageText, fileUrl, fileName, createdAt }: ChatMessageProps) {
  const isOwner = senderType === 'owner';
  const initials = senderName.split(' ').map(n => n[0]).join('').toUpperCase();
  const time = new Date(createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex gap-3 ${isOwner ? 'flex-row-reverse' : ''}`}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className={isOwner ? 'bg-blue-600 text-white' : 'bg-gray-300'}>{initials}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div className={`rounded-lg px-4 py-2 ${isOwner ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
          {messageText && <p className="text-sm">{messageText}</p>}
          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-1 text-sm underline">
              <Download className="h-4 w-4" />
              {fileName || 'Download file'}
            </a>
          )}
        </div>
        <span className="text-xs text-gray-500 mt-1">{time}</span>
      </div>
    </div>
  );
}
