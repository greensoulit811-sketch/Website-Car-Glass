import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Upload, GripVertical } from 'lucide-react';
import { uploadProductImage, deleteProductImage } from '@/lib/image-upload';

const DEFAULT_CONTENT = {
  emergencyPhone: "+60 11-6950 1634",
  stat1Value: "250+",
  stat1Label: "Project Complete",
  stat2Value: "1.5K",
  stat2Label: "Happy Customer",
  title: "Unleash The Shade, Car Tinting And Protection Excellence",
  description: "We're the trusted tinting experts in Malaysia. With years of experience, we deliver exceptional tinting solutions for cars.",
  features: [
    { icon: 'ShieldCheck', title: 'Expertise & Experience', description: 'We deliver exceptional tinting solutions for cars.' },
    { icon: 'Wand2', title: 'Attention To Detail', description: 'We deliver exceptional tinting solutions for cars.' },
    { icon: 'HeartHandshake', title: 'Customer Satisfaction', description: 'We deliver exceptional tinting solutions for cars.' }
  ],
  images: ['', '', '']
};

export default function WhyChooseUsManager() {
  const [data, setData] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: pageData, error } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page_slug', 'why-choose-us')
        .maybeSingle();

      if (error) throw error;

      if (pageData && pageData.content) {
        setData({ ...DEFAULT_CONTENT, ...JSON.parse(pageData.content) });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load Why Choose Us settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('page_contents')
        .select('id')
        .eq('page_slug', 'why-choose-us')
        .maybeSingle();

      if (existing) {
        await supabase
          .from('page_contents')
          .update({ content: JSON.stringify(data), updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('page_contents')
          .insert({
            page_slug: 'why-choose-us',
            page_title: 'Why Choose Us',
            content: JSON.stringify(data),
            is_active: true
          });
      }
      toast.success('Saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadProductImage(file, 'banners');
      const newImages = [...data.images];
      newImages[index] = url;
      setData({ ...data, images: newImages });
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  const handleRemoveImage = async (index: number) => {
    const url = data.images[index];
    if (url && url.includes('supabase.co')) {
      try { await deleteProductImage(url); } catch { /* ignore */ }
    }
    const newImages = [...data.images];
    newImages[index] = '';
    setData({ ...data, images: newImages });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="w-full pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase text-foreground">Why Choose Us Manager</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage the dynamic "Why Choose Us" section on the homepage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Bar Stats */}
        <div className="bg-card p-6 border border-border rounded-lg">
          <h2 className="text-xl font-bold text-foreground mb-4">Top Bar Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block uppercase font-bold tracking-widest">Emergency Phone</label>
              <input 
                type="text" 
                value={data.emergencyPhone}
                onChange={e => setData({...data, emergencyPhone: e.target.value})}
                className="w-full bg-background border border-border rounded px-4 py-2 text-sm text-foreground focus:border-[#00d5b4] focus:outline-none" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block uppercase font-bold tracking-widest">Stat 1 Value</label>
                <input type="text" value={data.stat1Value} onChange={e => setData({...data, stat1Value: e.target.value})} className="w-full bg-background border border-border rounded px-4 py-2 text-sm text-foreground" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block uppercase font-bold tracking-widest">Stat 1 Label</label>
                <input type="text" value={data.stat1Label} onChange={e => setData({...data, stat1Label: e.target.value})} className="w-full bg-background border border-border rounded px-4 py-2 text-sm text-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block uppercase font-bold tracking-widest">Stat 2 Value</label>
                <input type="text" value={data.stat2Value} onChange={e => setData({...data, stat2Value: e.target.value})} className="w-full bg-background border border-border rounded px-4 py-2 text-sm text-foreground" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block uppercase font-bold tracking-widest">Stat 2 Label</label>
                <input type="text" value={data.stat2Label} onChange={e => setData({...data, stat2Label: e.target.value})} className="w-full bg-background border border-border rounded px-4 py-2 text-sm text-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="bg-card p-6 border border-border rounded-lg">
          <h2 className="text-xl font-bold text-foreground mb-4">Main Content</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block uppercase font-bold tracking-widest">Section Title</label>
              <input 
                type="text" 
                value={data.title}
                onChange={e => setData({...data, title: e.target.value})}
                className="w-full bg-background border border-border rounded px-4 py-2 text-sm text-foreground" 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block uppercase font-bold tracking-widest">Description</label>
              <textarea 
                value={data.description}
                onChange={e => setData({...data, description: e.target.value})}
                className="w-full bg-background border border-border rounded px-4 py-2 text-sm text-foreground h-24" 
              />
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="bg-card p-6 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Features List</h2>
            <button 
              onClick={() => setData({...data, features: [...data.features, { icon: 'Star', title: 'New Feature', description: '' }]})}
              className="text-xs bg-secondary text-foreground px-3 py-1.5 rounded flex items-center gap-1 font-bold"
            >
              <Plus className="w-3 h-3" /> Add Feature
            </button>
          </div>
          <div className="space-y-4">
            {data.features.map((feature, i) => (
              <div key={i} className="flex gap-4 items-start bg-background p-4 rounded border border-border">
                <GripVertical className="w-5 h-5 text-muted-foreground mt-2 cursor-grab" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <input 
                      type="text" placeholder="Title" value={feature.title} 
                      onChange={e => { const f = [...data.features]; f[i].title = e.target.value; setData({...data, features: f}); }}
                      className="w-full bg-card border border-border rounded px-3 py-1.5 text-sm"
                    />
                    <input 
                      type="text" placeholder="Icon Name (e.g. ShieldCheck)" value={feature.icon} 
                      onChange={e => { const f = [...data.features]; f[i].icon = e.target.value; setData({...data, features: f}); }}
                      className="w-full bg-card border border-border rounded px-3 py-1.5 text-sm"
                    />
                  </div>
                  <textarea 
                    placeholder="Description" value={feature.description}
                    onChange={e => { const f = [...data.features]; f[i].description = e.target.value; setData({...data, features: f}); }}
                    className="w-full bg-card border border-border rounded px-3 py-1.5 text-sm h-full min-h-[60px]"
                  />
                </div>
                <button 
                  onClick={() => { const f = [...data.features]; f.splice(i, 1); setData({...data, features: f}); }}
                  className="text-red-500 hover:bg-red-500/10 p-2 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Collage Images */}
        <div className="bg-card p-6 border border-border rounded-lg">
          <h2 className="text-xl font-bold text-foreground mb-4">Collage Images (Left Side)</h2>
          <div className="grid grid-cols-3 gap-4">
            {data.images.map((img, i) => (
              <div key={i} className="border border-border rounded-lg p-2 bg-background relative aspect-square flex flex-col items-center justify-center overflow-hidden">
                {img ? (
                  <>
                    <img src={img} className="w-full h-full object-cover" alt={`Collage ${i+1}`} />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button onClick={() => handleRemoveImage(i)} className="bg-red-500 text-white p-2 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Upload Image {i+1}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(i, e)} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-8">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 bg-[#00d5b4] text-black font-bold px-8 py-3 rounded hover:bg-opacity-90 disabled:opacity-50 text-lg shadow-lg"
        >
          {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
