-- Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_reg_no TEXT NOT NULL,
    company_address TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    message TEXT,
    cart_items JSONB,
    cart_total DECIMAL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'quotations' AND policyname = 'Allow public insert'
    ) THEN
        CREATE POLICY "Allow public insert" ON public.quotations FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'quotations' AND policyname = 'Allow all for authenticated'
    ) THEN
        CREATE POLICY "Allow all for authenticated" ON public.quotations FOR ALL USING (true);
    END IF;
END $$;
