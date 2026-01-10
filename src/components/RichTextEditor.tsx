import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, Link, Image, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: () => void;
}

import { marked } from 'marked';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: () => void;
}

export function RichTextEditor({ value, onChange, onImageUpload }: RichTextEditorProps) {
  const [preview, setPreview] = useState(false);

  const insertMarkdown = (before: string, after = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value;
    const selectedText = text.substring(start, end) || 'text';
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    onChange(newText);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          insertMarkdown(`![${file.name}](${reader.result})`);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="border rounded-lg">
      <div className="flex gap-2 p-2 border-b bg-muted/50">
        <Button size="sm" variant="ghost" onClick={() => insertMarkdown('**', '**')}><Bold className="h-4 w-4" /></Button>
        <Button size="sm" variant="ghost" onClick={() => insertMarkdown('*', '*')}><Italic className="h-4 w-4" /></Button>
        <Button size="sm" variant="ghost" onClick={() => insertMarkdown('- ')}><List className="h-4 w-4" /></Button>
        <Button size="sm" variant="ghost" onClick={() => insertMarkdown('[', '](url)')}><Link className="h-4 w-4" /></Button>
        <Button size="sm" variant="ghost" onClick={onImageUpload || handleImageUpload}><Image className="h-4 w-4" /></Button>
        <Button size="sm" variant="ghost" onClick={() => insertMarkdown('`', '`')}><Code className="h-4 w-4" /></Button>
        <Button size="sm" variant="outline" onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</Button>
      </div>
      {preview ? (
        <div className="p-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(value) }} />
      ) : (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[400px] border-0 focus-visible:ring-0" />
      )}
    </div>
  );
}
