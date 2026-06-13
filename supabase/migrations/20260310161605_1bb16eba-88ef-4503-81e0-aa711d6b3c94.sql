
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name text NOT NULL,
  reviewer_image text DEFAULT '',
  review_text text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  show_for_all boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT TO public USING (true);
CREATE POLICY "Reviews insertable by anyone" ON public.reviews FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Reviews updatable by anyone" ON public.reviews FOR UPDATE TO public USING (true);
CREATE POLICY "Reviews deletable by anyone" ON public.reviews FOR DELETE TO public USING (true);

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
