import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', native: 'বাংলা', short: 'EN' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', short: 'বাং' },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find(l => l.code === language);
  const dropdownLabels: Record<string, string> = { en: 'English', bn: 'বাংলা' };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1.5 hover-neon transition-colors duration-300 text-foreground text-xs font-body tracking-wide uppercase"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span>{current?.short}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as 'en' | 'bn');
                setOpen(false);
              }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-body text-foreground hover:bg-neon/10 hover:text-neon transition-colors duration-150"
            >
              <span>{dropdownLabels[lang.code]}</span>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-neon" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
