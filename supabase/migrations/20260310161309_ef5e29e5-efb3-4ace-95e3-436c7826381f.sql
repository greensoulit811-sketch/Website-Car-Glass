
CREATE TABLE public.shipping_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  area_zone text NOT NULL DEFAULT '',
  charge numeric NOT NULL DEFAULT 0,
  estimated_delivery text DEFAULT '',
  description text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shipping methods viewable by everyone" ON public.shipping_methods FOR SELECT TO public USING (true);
CREATE POLICY "Shipping methods insertable by anyone" ON public.shipping_methods FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Shipping methods updatable by anyone" ON public.shipping_methods FOR UPDATE TO public USING (true);
CREATE POLICY "Shipping methods deletable by anyone" ON public.shipping_methods FOR DELETE TO public USING (true);

CREATE TRIGGER update_shipping_methods_updated_at BEFORE UPDATE ON public.shipping_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed default methods
INSERT INTO public.shipping_methods (name, area_zone, charge, estimated_delivery, description, sort_order) VALUES
  ('Standard Delivery', 'All Kuwait', 3, '2-4 days', 'Standard shipping across Kuwait', 1),
  ('Free Delivery (30+ KWD)', 'All Kuwait', 0, '2-4 days', 'Free shipping on orders 30 KWD and above', 0);
