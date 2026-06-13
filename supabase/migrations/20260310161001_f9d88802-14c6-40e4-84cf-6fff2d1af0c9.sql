
-- Visitor sessions table
CREATE TABLE public.visitor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  device_type text DEFAULT '',
  browser text DEFAULT '',
  os text DEFAULT '',
  referrer text DEFAULT '',
  entry_page text DEFAULT '',
  exit_page text DEFAULT '',
  country text DEFAULT '',
  city text DEFAULT '',
  ip_address text DEFAULT '',
  is_online boolean DEFAULT true,
  last_active_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitor sessions viewable by everyone" ON public.visitor_sessions FOR SELECT TO public USING (true);
CREATE POLICY "Visitor sessions insertable by anyone" ON public.visitor_sessions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Visitor sessions updatable by anyone" ON public.visitor_sessions FOR UPDATE TO public USING (true);

CREATE UNIQUE INDEX idx_visitor_sessions_session ON public.visitor_sessions(session_id);

CREATE TRIGGER update_visitor_sessions_updated_at BEFORE UPDATE ON public.visitor_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Page views table
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  page_url text NOT NULL,
  page_title text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Page views viewable by everyone" ON public.page_views FOR SELECT TO public USING (true);
CREATE POLICY "Page views insertable by anyone" ON public.page_views FOR INSERT TO public WITH CHECK (true);
