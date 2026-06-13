import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePageContent } from '@/hooks/usePageContents';
import { useSettings } from '@/hooks/useDatabase';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  const { data: page, isLoading } = usePageContent('contact');
  const { data: settings } = useSettings();

  return (
    <div className="min-h-screen bg-background pt-32 lg:pt-36">
      <Navbar />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="heading-display text-4xl md:text-6xl font-bold mb-8 text-foreground">
              {isLoading ? 'Loading...' : page?.page_title || 'Contact Us'}
            </h1>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                {page?.content && (
                  <div className="mb-8">
                    {page.content.split('\n').map((paragraph, i) => (
                      paragraph.trim() ? (
                        <p key={i} className="font-body text-muted-foreground leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      ) : null
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {(settings as any)?.contact_email && (
                  <a href={`mailto:${(settings as any).contact_email}`} className="flex items-start gap-4 p-5 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors group">
                    <div className="w-12 h-12 bg-neon/10 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-neon" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-foreground mb-1">Email</h3>
                      <p className="font-body text-sm text-muted-foreground group-hover:text-neon transition-colors">{(settings as any).contact_email}</p>
                    </div>
                  </a>
                )}

                {(settings as any)?.contact_phone && (
                  <a href={`tel:${(settings as any).contact_phone}`} className="flex items-start gap-4 p-5 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors group">
                    <div className="w-12 h-12 bg-neon/10 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-neon" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-foreground mb-1">Phone</h3>
                      <p className="font-body text-sm text-muted-foreground group-hover:text-neon transition-colors">{(settings as any).contact_phone}</p>
                    </div>
                  </a>
                )}

                {(settings as any)?.contact_address && (
                  <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-lg">
                    <div className="w-12 h-12 bg-neon/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-neon" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-foreground mb-1">Address</h3>
                      <p className="font-body text-sm text-muted-foreground">{(settings as any).contact_address}</p>
                    </div>
                  </div>
                )}

                {settings?.whatsapp_number && (
                  <a href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-4 p-5 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors group">
                    <div className="w-12 h-12 bg-neon/10 rounded-full flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-neon" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-foreground mb-1">WhatsApp</h3>
                      <p className="font-body text-sm text-muted-foreground group-hover:text-neon transition-colors">{settings.whatsapp_number}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
