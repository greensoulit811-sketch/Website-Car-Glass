
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS facebook_pixel_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS facebook_pixel_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS facebook_capi_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS facebook_access_token text DEFAULT '',
  ADD COLUMN IF NOT EXISTS facebook_test_event_code text DEFAULT '',
  ADD COLUMN IF NOT EXISTS facebook_api_version text DEFAULT 'v21.0',
  ADD COLUMN IF NOT EXISTS tracking_pageview boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS tracking_viewcontent boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS tracking_addtocart boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS tracking_initiatecheckout boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS tracking_purchase boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS tracking_lead boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS tracking_complete_registration boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS default_content_type text DEFAULT 'product';
