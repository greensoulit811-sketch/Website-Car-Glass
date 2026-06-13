import { useSettings, useUpdateSettings } from '@/hooks/useDatabase';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const Field = ({ label, field, type = 'text', placeholder = '', form, setForm }: { label: string; field: string; type?: string; placeholder?: string; form: any; setForm: any }) => (
  <div>
    <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</label>
    <input type={type} value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: type === 'number' ? +e.target.value : e.target.value })} placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-border bg-background rounded-md font-body text-sm text-foreground focus:outline-none focus:border-primary" />
  </div>
);

const TextArea = ({ label, field, rows = 2, form, setForm }: { label: string; field: string; rows?: number; form: any; setForm: any }) => (
  <div>
    <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</label>
    <textarea value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} rows={rows}
      className="w-full px-4 py-2.5 border border-border bg-background rounded-md font-body text-sm text-foreground focus:outline-none focus:border-primary resize-none" />
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card border border-border p-6 rounded-lg">
    <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 text-foreground">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const SettingsPage = () => {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const s = settings as any;
  const [form, setForm] = useState({
    site_name: '', site_description: '', meta_title: '', meta_description: '',
    whatsapp_number: '', instagram_handle: '', free_shipping_threshold: 150, currency: 'RM',
    language: 'en',
    logo_url: '', favicon_url: '', footer_description: '', footer_copyright: '', footer_tagline: '',
    contact_email: '', contact_phone: '', contact_address: '',
    facebook_url: '', twitter_url: '', youtube_url: '', instagram_url: '',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        site_name: s.site_name || '', site_description: s.site_description || '',
        meta_title: s.meta_title || '', meta_description: s.meta_description || '',
        whatsapp_number: s.whatsapp_number || '', instagram_handle: s.instagram_handle || '',
        free_shipping_threshold: Number(s.free_shipping_threshold) || 150, currency: s.currency || 'RM',
        language: s.language || 'en',
        logo_url: s.logo_url || '/logo.png', favicon_url: s.favicon_url || '/favicon.ico',
        footer_description: s.footer_description || '', footer_copyright: s.footer_copyright || '', footer_tagline: s.footer_tagline || '',
        contact_email: s.contact_email || '', contact_phone: s.contact_phone || '', contact_address: s.contact_address || '',
        facebook_url: s.facebook_url || '', twitter_url: s.twitter_url || '', youtube_url: s.youtube_url || '', instagram_url: s.instagram_url || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync(form);
      toast.success('Settings saved');
    } catch (error: any) {
      console.error('Settings save error:', error);
      toast.error(error?.message || 'Failed to save settings');
    }
  };

  if (isLoading) return <p className="text-center py-10 text-muted-foreground">Loading...</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-foreground">Settings</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Store configuration, branding & SEO</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        <Section title="Store Identity">
          <Field label="Site Name" field="site_name" form={form} setForm={setForm} />
          <TextArea label="Site Description" field="site_description" form={form} setForm={setForm} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Logo URL" field="logo_url" placeholder="/logo.png" form={form} setForm={setForm} />
            <Field label="Favicon URL" field="favicon_url" placeholder="/favicon.ico" form={form} setForm={setForm} />
          </div>
          {form.logo_url && (
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-md">
                <img src={form.logo_url} alt="Logo preview" className="h-10 w-auto" />
              </div>
              <span className="font-body text-xs text-muted-foreground">Logo preview</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Currency" field="currency" form={form} setForm={setForm} />
            <Field label="Free Shipping Min" field="free_shipping_threshold" type="number" form={form} setForm={setForm} />
          </div>
          <div>
            <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Website Language</label>
            <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}
              className="w-full px-4 py-2.5 border border-border bg-background rounded-md font-body text-sm text-foreground focus:outline-none focus:border-primary">
              <option value="en">English</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
            <p className="font-body text-xs text-muted-foreground mt-1">This changes the entire frontend language and direction (RTL for Arabic)</p>
          </div>
        </Section>

        <Section title="SEO Settings">
          <Field label="Meta Title" field="meta_title" form={form} setForm={setForm} />
          <p className="font-body text-xs text-muted-foreground -mt-3">{form.meta_title.length}/60 characters</p>
          <TextArea label="Meta Description" field="meta_description" form={form} setForm={setForm} />
          <p className="font-body text-xs text-muted-foreground -mt-3">{form.meta_description.length}/160 characters</p>
        </Section>

        <Section title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Contact Email" field="contact_email" placeholder="info@example.com" form={form} setForm={setForm} />
            <Field label="Contact Phone" field="contact_phone" placeholder="+965 1234 5678" form={form} setForm={setForm} />
          </div>
          <Field label="Address" field="contact_address" placeholder="Kuala Lumpur, Malaysia" form={form} setForm={setForm} />
          <Field label="WhatsApp Number" field="whatsapp_number" placeholder="+96512345678" form={form} setForm={setForm} />
        </Section>

        <Section title="Social Media Links">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Instagram URL" field="instagram_url" placeholder="https://instagram.com/..." form={form} setForm={setForm} />
            <Field label="Facebook URL" field="facebook_url" placeholder="https://facebook.com/..." form={form} setForm={setForm} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Twitter URL" field="twitter_url" placeholder="https://twitter.com/..." form={form} setForm={setForm} />
            <Field label="YouTube URL" field="youtube_url" placeholder="https://youtube.com/..." form={form} setForm={setForm} />
          </div>
          <Field label="Instagram Handle (legacy)" field="instagram_handle" form={form} setForm={setForm} />
        </Section>

        <Section title="Footer Settings">
          <TextArea label="Footer Description" field="footer_description" form={form} setForm={setForm} />
          <Field label="Copyright Text" field="footer_copyright" placeholder="© 2026 Store Name. All rights reserved." form={form} setForm={setForm} />
          <Field label="Footer Tagline" field="footer_tagline" placeholder="🇲🇾 Free delivery across Malaysia" form={form} setForm={setForm} />
        </Section>

        <button type="submit" disabled={updateSettings.isPending}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-body text-sm font-bold tracking-wider uppercase hover:bg-primary/90 transition-all disabled:opacity-50">
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
