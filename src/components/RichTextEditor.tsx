import { useRef, useState } from 'react';
import { marked } from 'marked';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, Link, Image, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file?: File) => Promise<string | void> | string | void;
}

export function RichTextEditor({ value, onChange, onImageUpload }: RichTextEditorProps) {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertMarkdown = (before: string, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentValue = textarea.value;
    const start = textarea.selectionStart ?? currentValue.length;
    const end = textarea.selectionEnd ?? currentValue.length;
    const selectedText = currentValue.substring(start, end) || 'text';

    const newText =
      currentValue.substring(0, start) +
      before +
      selectedText +
      after +
      currentValue.substring(end);

    onChange(newText);

    requestAnimationFrame(() => {
      const cursorStart = start + before.length;
      const cursorEnd = cursorStart + selectedText.length;
      textarea.focus();
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      let imageUrl: string | undefined;
      if (onImageUpload) {
        const result = await onImageUpload(file);
        if (typeof result === 'string') {
          imageUrl = result;
        }
      }

      if (imageUrl) {
        insertMarkdown(`![${file.name}](${imageUrl})`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          insertMarkdown(`![${file.name}](${reader.result})`);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleLinkInsert = () => {
    const url = window.prompt('Enter URL');
    if (!url) return;
    insertMarkdown('[', `](${url})`);
  };

  const renderPreview = () => {
    const html = marked.parse(value || '');
    if (typeof html !== 'string') {
      return <p className="text-slate-400">Preview is loading...</p>;
    }
    return <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/80 p-2">
        <Button type="button" variant="ghost" size="icon" onClick={() => insertMarkdown('**', '**')} aria-label="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => insertMarkdown('*', '*')} aria-label="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => insertMarkdown('\n- ', '')} aria-label="List">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={handleLinkInsert} aria-label="Link">
          <Link className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={handleImageUpload} aria-label="Image">
          <Image className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => insertMarkdown('`', '`')} aria-label="Code">
          <Code className="h-4 w-4" />
        </Button>
        <div className="ml-auto flex items-center gap-1">
          <Button type="button" variant={!preview ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreview(false)}>
            Edit
          </Button>
          <Button type="button" variant={preview ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreview(true)}>
            Preview
          </Button>
        </div>
      </div>
      {preview ? (
        <div className="min-h-[160px] p-3 text-sm">
          {value ? renderPreview() : <p className="text-slate-400">Nothing to preview yet.</p>}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          className="min-h-[160px] rounded-none border-0 focus-visible:ring-0 focus-visible:border-transparent"
        />
      )}
    </div>
  );
}

export default RichTextEditor;
