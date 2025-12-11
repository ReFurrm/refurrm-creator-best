import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  template_type: string;
  html_content: string;
  text_content: string;
  merge_tags: string[];
  is_active: boolean;
}

export default function EmailTemplates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    template_type: 'welcome',
    html_content: '',
    text_content: '',
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('*').order('created_at', { ascending: false });
    if (data) setTemplates(data);
  };
  const handleSave = async () => {
    if (selectedTemplate) {
      await supabase.from('email_templates').update(formData).eq('id', selectedTemplate.id);
    } else {
      await supabase.from('email_templates').insert({ ...formData, created_by: user?.id });
    }
    loadTemplates();
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleTestEmail = async () => {
    if (!user?.email) return;
    
    // Replace merge tags with sample data
    let testContent = formData.html_content;
    testContent = testContent.replace(/{{name}}/g, user.user_metadata?.full_name || 'Customer');
    testContent = testContent.replace(/{{email}}/g, user.email);
    testContent = testContent.replace(/{{product}}/g, 'Sample Product');
    testContent = testContent.replace(/{{order_id}}/g, '#12345');
    testContent = testContent.replace(/{{amount}}/g, '$99.99');
    testContent = testContent.replace(/{{link}}/g, 'https://example.com');

    // In production, this would call an edge function to send email
    console.log('Test email would be sent to:', user.email);
    console.log('Content:', testContent);
    alert(`Test email preview:\n\nTo: ${user.email}\nSubject: ${formData.subject}\n\nContent has been logged to console.`);
  };

  const insertMergeTag = (tag: string) => {
    setFormData({ ...formData, html_content: formData.html_content + ' ' + tag });
  };


  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      template_type: template.template_type,
      html_content: template.html_content,
      text_content: template.text_content,
    });
    setIsEditing(true);
  };

  const mergeTags = ['{{name}}', '{{email}}', '{{product}}', '{{order_id}}', '{{amount}}', '{{link}}'];

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-black text-white mb-8">Email Templates</h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-slate-800 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Templates</h2>
              <Button onClick={() => { setIsEditing(true); setSelectedTemplate(null); }} size="sm">New</Button>
            </div>
            <div className="space-y-2">
              {templates.map((t) => (
                <div key={t.id} onClick={() => handleEdit(t)} className="p-3 bg-slate-700 rounded cursor-pointer hover:bg-slate-600">
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-slate-400">{t.template_type}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2 bg-slate-800 border-slate-700 p-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Template Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <Label className="text-white">Type</Label>
                  <Select value={formData.template_type} onValueChange={(v) => setFormData({ ...formData, template_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome</SelectItem>
                      <SelectItem value="password_reset">Password Reset</SelectItem>
                      <SelectItem value="order_confirmation">Order Confirmation</SelectItem>
                      <SelectItem value="trial_reminder">Trial Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Subject</Label>
                  <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                </div>
                <div>
                  <Label className="text-white">HTML Content</Label>
                  <Textarea rows={8} value={formData.html_content} onChange={(e) => setFormData({ ...formData, html_content: e.target.value })} />
                </div>
                <div>
                  <Label className="text-white">Merge Tags (click to insert)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mergeTags.map((tag) => (
                      <button 
                        key={tag} 
                        onClick={() => insertMergeTag(tag)}
                        className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Template</Button>
                  <Button variant="outline" onClick={handleTestEmail}>Send Test Email</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>

              </div>
            ) : (
              <div className="text-center text-slate-400 py-12">Select or create a template</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
