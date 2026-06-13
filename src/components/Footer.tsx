import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { useSettings } from '@/hooks/useDatabase';
import { useActiveCategories } from '@/hooks/useCategories';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const { data: settings } = useSettings();
  const { data: categories = [] } = useActiveCategories();
  const { t } = useLanguage();
  const s = settings as any;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <img src={s?.logo_url || '/logos.png'} alt={s?.site_name || 'Store'} className="h-14 w-auto mb-4" />
            <p className="text-primary-foreground/60 font-body text-sm leading-relaxed mb-6">
              {s?.footer_description || 'Your ultimate destination for premium laptops and tech accessories in Malaysia.'}
            </p>
            <div className="flex gap-4">
              {s?.instagram_url && <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/40 hover:text-neon transition-colors"><Instagram className="w-5 h-5" /></a>}
              {s?.facebook_url && <a href={s.facebook_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/40 hover:text-neon transition-colors"><Facebook className="w-5 h-5" /></a>}
              {s?.twitter_url && <a href={s.twitter_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/40 hover:text-neon transition-colors"><Twitter className="w-5 h-5" /></a>}
              {s?.youtube_url && <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/40 hover:text-neon transition-colors"><Youtube className="w-5 h-5" /></a>}
              {!s?.instagram_url && !s?.facebook_url && !s?.twitter_url && !s?.youtube_url && (
                <>
                  <span className="text-primary-foreground/40"><Instagram className="w-5 h-5" /></span>
                  <span className="text-primary-foreground/40"><Facebook className="w-5 h-5" /></span>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold uppercase tracking-wider mb-4">{t('footer.shop')}</h4>
            <ul className="space-y-3 font-body text-sm text-primary-foreground/60">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}><Link to={`/appointment`} className="hover:text-neon transition-colors">{cat.name}</Link></li>
              ))}
              {categories.length === 0 && <li><Link to="/appointment" className="hover:text-neon transition-colors">{t('footer.all_products')}</Link></li>}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold uppercase tracking-wider mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3 font-body text-sm text-primary-foreground/60">
              <li><Link to="/about" className="hover:text-neon transition-colors">{t('footer.about')}</Link></li>
              <li><Link to="/contact" className="hover:text-neon transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/appointment" className="hover:text-neon transition-colors">Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold uppercase tracking-wider mb-4">{t('footer.contact_title')}</h4>
            <div className="font-body text-sm text-primary-foreground/40 space-y-2">
              {s?.contact_address && <p>{s.contact_address}</p>}
              {s?.contact_email && <p>{s.contact_email}</p>}
              {s?.contact_phone && <p>{s.contact_phone}</p>}
              {s?.whatsapp_number && <p>{t('footer.whatsapp')}: {s.whatsapp_number}</p>}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-primary-foreground/40">{s?.footer_copyright || '© 2026 Bright Beam. All rights reserved.'}</p>
          <p className="font-body text-xs text-primary-foreground/40">{s?.footer_tagline || '🇲🇾 Free delivery across Malaysia · Cash on Delivery available'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
