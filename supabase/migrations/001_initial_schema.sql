-- SellOrNotSell initial schema
-- Shares leads table with SearchStrata

-- ── Leads table (shared with SearchStrata) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  consent_marketing BOOLEAN NOT NULL DEFAULT false,
  consent_privacy BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'sellornotsell' CHECK (source IN ('sellornotsell', 'searchstrata')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);

-- ── Assessments table ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- Purchase & mortgage
  purchase_price NUMERIC NOT NULL,
  purchase_year INTEGER NOT NULL,
  down_payment_percent NUMERIC NOT NULL DEFAULT 0,
  mortgage_balance NUMERIC NOT NULL,
  mortgage_rate NUMERIC NOT NULL,
  mortgage_type TEXT NOT NULL CHECK (mortgage_type IN ('fixed', 'variable')),
  amortization_years INTEGER NOT NULL,
  remaining_term_years INTEGER NOT NULL DEFAULT 5,

  -- Property details
  property_type TEXT NOT NULL CHECK (property_type IN ('detached', 'semi-detached', 'townhouse', 'condo', 'duplex', 'other')),
  estimated_value NUMERIC NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  square_feet INTEGER NOT NULL DEFAULT 0,
  condo_fees NUMERIC NOT NULL DEFAULT 0,
  property_tax NUMERIC NOT NULL,
  major_renovations TEXT DEFAULT '',

  -- Goals
  selling_reason TEXT NOT NULL,
  timeline TEXT NOT NULL,
  move_destination TEXT DEFAULT '',
  additional_notes TEXT DEFAULT '',

  -- AI result (populated after Claude API call)
  verdict TEXT CHECK (verdict IN ('SELL', 'HOLD')),
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')),
  financials JSONB,
  reasoning JSONB,
  considerations JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessments_lead_id ON assessments (lead_id);
CREATE INDEX IF NOT EXISTS idx_assessments_verdict ON assessments (verdict);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments (created_at DESC);

-- ── Market data table ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  avg_price NUMERIC NOT NULL,
  median_price NUMERIC NOT NULL,
  avg_days_on_market INTEGER NOT NULL DEFAULT 0,
  price_change_yoy NUMERIC NOT NULL DEFAULT 0, -- percentage year-over-year
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (province, city)
);

CREATE INDEX IF NOT EXISTS idx_market_data_province ON market_data (province);

-- ── Bank rates table ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bank_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_type TEXT NOT NULL CHECK (rate_type IN ('prime', 'fixed_5yr', 'variable')),
  rate NUMERIC NOT NULL,
  effective_date DATE NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rate_type, effective_date)
);

-- ── Row Level Security ─────────────────────────────────────────────────────────
-- Service role key bypasses RLS, but enable it for safety

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_rates ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (service role bypasses RLS automatically)
-- No public/anon access policies — all access is server-side via service role key
