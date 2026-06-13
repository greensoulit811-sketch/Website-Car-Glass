
-- Create page_contents table for About Us, Contact Us, etc.
CREATE TABLE public.page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL UNIQUE,
  page_title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Page contents viewable by everyone" ON public.page_contents FOR SELECT TO public USING (true);
CREATE POLICY "Page contents insertable by anyone" ON public.page_contents FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Page contents updatable by anyone" ON public.page_contents FOR UPDATE TO public USING (true);
CREATE POLICY "Page contents deletable by anyone" ON public.page_contents FOR DELETE TO public USING (true);

-- Seed default pages
INSERT INTO public.page_contents (page_slug, page_title, content) VALUES
('about', 'About Us', 'Welcome to SRK Collection – your ultimate destination for authentic sports footwear in Kuwait. We bring you the latest and greatest from Nike, Adidas, Puma, and more top brands.\n\nOur mission is to provide 100% authentic, high-quality sports shoes with exceptional customer service and fast delivery across Kuwait.\n\nWe believe every athlete deserves the best gear to fuel their performance.'),
('contact', 'Contact Us', 'We would love to hear from you! Reach out to us through any of the following channels.\n\nOur team is available Saturday to Thursday, 9 AM to 9 PM Kuwait time.');

-- Add new columns to site_settings for footer, logo, favicon, social links, contact info
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '/logo.png',
  ADD COLUMN IF NOT EXISTS favicon_url text DEFAULT '/favicon.ico',
  ADD COLUMN IF NOT EXISTS footer_description text DEFAULT 'Your ultimate destination for authentic sports footwear in Kuwait. Nike, Adidas, Puma, and more.',
  ADD COLUMN IF NOT EXISTS footer_copyright text DEFAULT '© 2026 SRK Collection. All rights reserved.',
  ADD COLUMN IF NOT EXISTS footer_tagline text DEFAULT '🇰🇼 Free delivery across Kuwait · Cash on Delivery available',
  ADD COLUMN IF NOT EXISTS contact_email text DEFAULT 'info@srkcollection.kw',
  ADD COLUMN IF NOT EXISTS contact_phone text DEFAULT '+965 1234 5678',
  ADD COLUMN IF NOT EXISTS contact_address text DEFAULT 'Kuwait City, Kuwait',
  ADD COLUMN IF NOT EXISTS facebook_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS twitter_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS youtube_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_short text DEFAULT 'Premium sports shoes in Kuwait';
