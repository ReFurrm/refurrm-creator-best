import { useState } from 'react';
import { marked } from 'marked';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, Link, Image, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: () => void;
}

function RichTextEditor({ value, onChange, onImageUpload }: RichTextEditorProps) {
  const [preview, setPreview] = useState(false);

  const insertMarkdown = (before: string, after = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';

    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    in
