-- ==============================================================================
-- SMART CROP ADVISORY & DISTRESS EARLY-WARNING SYSTEM
-- Supabase (PostgreSQL) Database Schema
-- ==============================================================================

-- Enable UUID extension if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. FARMERS TABLE
-- Stores farmer profiles, location, crop details, and loan obligations
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    primary_crop TEXT NOT NULL,
    land_size NUMERIC, -- In acres or hectares
    loan_due_date DATE,
    preferred_language TEXT DEFAULT 'hi', -- 'hi' or 'en'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. CROP PRICES TABLE
-- Stores daily/historical APMC mandi commodity prices
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crop_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_name TEXT NOT NULL,
    district TEXT NOT NULL,
    price_per_quintal NUMERIC NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ------------------------------------------------------------------------------
-- 3. WEATHER SNAPSHOTS TABLE
-- Stores daily weather observations, rainfall deviations, and distress alerts
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weather_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    rainfall_mm NUMERIC DEFAULT 0,
    expected_rainfall_mm NUMERIC DEFAULT 0,
    temp_c NUMERIC,
    alert_type TEXT CHECK (alert_type IN ('storm', 'drought', 'flood', 'none')) DEFAULT 'none'
);

-- ------------------------------------------------------------------------------
-- 4. SCHEMES TABLE
-- Directory of Government schemes, subsidies, and insurance programs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    eligibility TEXT,
    contact_info TEXT,
    link TEXT
);

-- ------------------------------------------------------------------------------
-- 5. DISTRESS SCORES TABLE
-- Tracks calculated distress risk index, early-warning triggers, and factors
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.distress_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 0 AND score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    triggered_factors JSONB DEFAULT '{}'::jsonb, -- e.g. {"monsoon_deficit": true, "price_crash": false, "loan_due_soon": true}
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 6. MOOD CHECKINS TABLE
-- Tracks farmer sentiment and psychological well-being over time
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mood_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
    mood TEXT NOT NULL CHECK (mood IN ('good', 'okay', 'struggling')),
    date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_farmers_district ON public.farmers(district);
CREATE INDEX IF NOT EXISTS idx_crop_prices_lookup ON public.crop_prices(crop_name, district, date);
CREATE INDEX IF NOT EXISTS idx_weather_lookup ON public.weather_snapshots(district, date);
CREATE INDEX IF NOT EXISTS idx_distress_farmer_created ON public.distress_scores(farmer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_farmer_date ON public.mood_checkins(farmer_id, date DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) CONFIGURATION
-- ==============================================================================
-- Enable RLS on all 6 tables as standard security practice in Supabase.
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distress_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- DEMO / HACKATHON POLICIES (PERMISSIVE ACCESS)
-- 
-- TODO: TIGHTEN POLICIES FOR PRODUCTION!
-- ------------------------------------------------------------------------------
-- Currently, these policies permit all CRUD operations (SELECT, INSERT, UPDATE, DELETE)
-- for fast prototyping and demo setups.
-- In production, replace with strict policies, such as:
--   - Public SELECT for schemes and crop_prices
--   - Authenticated user checks (e.g., auth.uid() = farmer_id) for farmers, distress_scores, mood_checkins
--   - Role-based write access for admin/backend service keys
-- ------------------------------------------------------------------------------

CREATE POLICY "Demo permissive policy for farmers"
    ON public.farmers
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Demo permissive policy for crop_prices"
    ON public.crop_prices
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Demo permissive policy for weather_snapshots"
    ON public.weather_snapshots
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Demo permissive policy for schemes"
    ON public.schemes
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Demo permissive policy for distress_scores"
    ON public.distress_scores
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Demo permissive policy for mood_checkins"
    ON public.mood_checkins
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- OPTIONAL SAMPLE SEED DATA (FOR IMMEDIATE TESTING)
-- ==============================================================================
INSERT INTO public.schemes (name, description, eligibility, contact_info, link) VALUES
('PM-KISAN Samman Nidhi', 'Direct income support of ₹6,000 per year to small and marginal farmer families in three equal installments.', 'All landholding farmer families with cultivable land in their names.', 'Toll Free: 155261 / 011-24300606', 'https://pmkisan.gov.in'),
('Pradhan Mantri Fasal Bima Yojana (PMFBY)', 'Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest.', 'All farmers growing notified crops in notified areas (both loanee and non-loanee).', 'Toll Free: 1800-180-1551', 'https://pmfby.gov.in'),
('Kisan Credit Card (KCC)', 'Provides timely credit to farmers for agricultural cultivation, post-harvest expenses, and farm asset maintenance.', 'All farmers, individual/joint borrowers, tenant farmers, and SHGs.', 'Contact local bank branch or KCC Helpline', 'https://myscheme.gov.in'),
('Soil Health Card Scheme', 'Provides soil testing reports and customized crop-wise fertilizer recommendations.', 'All farmers with agricultural land across India.', 'Local District Agriculture Officer / KVK', 'https://soilhealth.dac.gov.in')
ON CONFLICT DO NOTHING;
