import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Upload, Trash2, X } from 'lucide-react';
import { uploadProductImage, deleteProductImage } from '@/lib/image-upload';

const DEFAULT_CONTENT = {
  carImage: "/placeholder.svg",
  testimonials: [
    {
      text: "I can't thank UVision Auto enough for the outstanding tint service they provided. They transformed my car's windows from faded and unreliable to sleek and flawlessly shaded. Their attention to detail was second to none, and the nano-ceramic film keeps my cabin cooler while blocking harmful UV rays. Plus, their expert team guided me to the perfect tint level, eliminating glare on every drive. I'm beyond impressed with their professionalism and craftsmanship - highly recommended for anyone seeking top-tier car tinting!",
      authorName: "Elsa Verina",
      authorRole: "Designation",
      authorImage: "/placeholder.svg"
    }
  ]
};

export default function TestimonialManager() {
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
        .eq('page_slug', 'testimonial-section')
        .maybeSingle();

      if (error) throw error;

      if (pageData && pageData.content) {
        const parsed = JSON.parse(pageData.content);
        // Backwards compatibility
        if (!parsed.testimonials) {
          setData({
            carImage: parsed.carImage || "/placeholder.svg",
            testimonials: [{
              text: parsed.text || DEFAULT_CONTENT.testimonials[0].text,
              authorName: parsed.authorName || "Elsa Verina",
              authorRole: parsed.authorRole || "Designation",
              authorImage: parsed.authorImage || "/placeholder.svg"
            }]
          });
        } else {
          setData({ ...DEFAULT_CONTENT, ...parsed });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load Testimonial settings');
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
        .eq('page_slug', 'testimonial-section')
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
            page_slug: 'testimonial-section',
            page_title: 'Testimonial',
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

  const handleCarImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadProductImage(file, 'banners');
      setData({ ...data, carImage: url });
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  const handleAuthorImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadProductImage(file, 'banners');
      const newTestimonials = [...data.testimonials];
      newTestimonials[index].authorImage = url;
      setData({ ...data, testimonials: newTestimonials });
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  const handleRemoveCarImage = async () => {
    if (data.carImage && data.carImage.includes('supabase.co')) {
      try { await deleteProductImage(data.carImage); } catch { /* ignore */ }
    }
    setData({ ...data, carImage: '' });
  };

  const handleRemoveAuthorImage = async (index: number) => {
    const url = data.testimonials[index].authorImage;
    if (url && url.includes('supabase.co')) {
      try { await deleteProductImage(url); } catch { /* ignore */ }
    }
    const newTestimonials = [...data.testimonials];
    newTestimonials[index].authorImage = '';
    setData({ ...data, testimonials: newTestimonials });
  };

  const addTestimonial = () => {
    setData({
      ...data,
      testimonials: [
        ...data.testimonials,
        { text: "", authorName: "New Customer", authorRole: "Customer", authorImage: "" }
      ]
    });
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = [...data.testimonials];
    newTestimonials.splice(index, 1);
    setData({ ...data, testimonials: newTestimonials });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="w-full pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase text-foreground">Testimonial Manager</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage the dynamic "Testimonial" section on the homepage.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Right Side Image (Global) */}
        <div className="bg-card p-6 border border-border rounded-lg lg:w-1/3 shrink-0 self-start">
          <h2 className="text-xl font-bold text-foreground mb-4">Right Side Cover Image (Global)</h2>
          <div className="border border-border rounded-lg p-2 bg-background relative aspect-video max-w-sm flex flex-col items-center justify-center overflow-hidden">
            {data.carImage ? (
              <>
                <img src={data.carImage} className="w-full h-full object-cover" alt="Car" />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button onClick={handleRemoveCarImage} className="bg-red-500 text-white p-2 rounded-full">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors">
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-center">Upload Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleCarImageUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Testimonials Array */}
        <div className="bg-card p-6 border border-border rounded-lg flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Customer Testimonials</h2>
            <button 
              onClick={addTestimonial}
              className="text-xs bg-[#F59E0B] text-black px-3 py-1.5 rounded flex items-center gap-1 font-bold"
            >
              Add Testimonial
            </button>
          </div>
          
          <div className="space-y-8">
            {data.testimonials.map((t, index) => (
              <div key={index} className="p-4 border border-border rounded bg-background relative">
                <button 
                  onClick={() => removeTestimonial(index)}
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-500/10 p-1.5 rounded"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <h3 className="font-bold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Testimonial #{index + 1}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Author Image */}
                  <div className="col-span-1">
                    <label className="text-xs text-muted-foreground mb-2 block uppercase font-bold tracking-widest">Author Photo</label>
                    <div className="border border-border rounded-lg p-2 bg-card relative aspect-square max-w-[120px] flex flex-col items-center justify-center overflow-hidden">
                      {t.authorImage ? (
                        <>
                          <img src={t.authorImage} className="w-full h-full object-cover" alt="Author" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button onClick={() => handleRemoveAuthorImage(index)} className="bg-red-500 text-white p-2 rounded-full">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors">
                          <Upload className="w-4 h-4 mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-center">Upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAuthorImageUpload(index, e)} />
                        </label>
                      )}
                    </div>
                  </div>
                  
                  {/* Text Details */}
                  <div className="col-span-2 space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block uppercase font-bold tracking-widest">Review Text</label>
                      <textarea 
                        value={t.text}
                        onChange={e => {
                          const newT = [...data.testimonials];
                          newT[index].text = e.target.value;
                          setData({...data, testimonials: newT});
                        }}
                        className="w-full bg-card border border-border rounded px-4 py-2 text-sm text-foreground h-24" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block uppercase font-bold tracking-widest">Customer Name</label>
                        <input 
                          type="text" 
                          value={t.authorName}
                          onChange={e => {
                            const newT = [...data.testimonials];
                            newT[index].authorName = e.target.value;
                            setData({...data, testimonials: newT});
                          }}
                          className="w-full bg-card border border-border rounded px-4 py-2 text-sm text-foreground" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block uppercase font-bold tracking-widest">Designation</label>
                        <input 
                          type="text" 
                          value={t.authorRole}
                          onChange={e => {
                            const newT = [...data.testimonials];
                            newT[index].authorRole = e.target.value;
                            setData({...data, testimonials: newT});
                          }}
                          className="w-full bg-card border border-border rounded px-4 py-2 text-sm text-foreground" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 bg-[#F59E0B] text-black font-bold px-8 py-3 rounded hover:bg-opacity-90 disabled:opacity-50 text-lg shadow-lg"
        >
          {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </div>

    </div>
  );
}
