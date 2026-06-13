
CREATE TABLE public.checkout_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  customer_name text DEFAULT '',
  customer_phone text NOT NULL,
  customer_email text DEFAULT '',
  shipping_address text DEFAULT '',
  area text DEFAULT '',
  notes text DEFAULT '',
  cart_items jsonb DEFAULT '[]'::jsonb,
  cart_total numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'pending_checkout',
  contacted boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.checkout_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Checkout leads viewable by everyone" ON public.checkout_leads FOR SELECT TO public USING (true);
CREATE POLICY "Checkout leads insertable by anyone" ON public.checkout_leads FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Checkout leads updatable by anyone" ON public.checkout_leads FOR UPDATE TO public USING (true);
CREATE POLICY "Checkout leads deletable by anyone" ON public.checkout_leads FOR DELETE TO public USING (true);

CREATE TRIGGER update_checkout_leads_updated_at BEFORE UPDATE ON public.checkout_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE UNIQUE INDEX idx_checkout_leads_session ON public.checkout_leads(session_id) WHERE status = 'pending_checkout';
