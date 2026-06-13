
-- Add SKU to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku text DEFAULT '';

-- Create product_variations table
CREATE TABLE IF NOT EXISTS public.product_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  size text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '',
  sku text DEFAULT '',
  price numeric DEFAULT NULL,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Variations viewable by everyone" ON public.product_variations FOR SELECT TO public USING (true);
CREATE POLICY "Variations insertable by anyone" ON public.product_variations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Variations updatable by anyone" ON public.product_variations FOR UPDATE TO public USING (true);
CREATE POLICY "Variations deletable by anyone" ON public.product_variations FOR DELETE TO public USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_product_variations_updated_at
  BEFORE UPDATE ON public.product_variations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_variations;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'product-images');
CREATE POLICY "Anyone can upload product images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Anyone can update product images" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'product-images');
CREATE POLICY "Anyone can delete product images" ON storage.objects FOR DELETE TO public USING (bucket_id = 'product-images');
