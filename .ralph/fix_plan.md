# Ralph Fix Plan

## High Priority
- [x] Initialize Next.js 15 project with App Router, Tailwind CSS, and TypeScript
- [x] Set up Supabase client configuration (server-side service role, environment variables)
- [x] Create database schema migrations (leads, assessments, market_data, bank_rates tables)
- [x] Build landing page (`/`) with value proposition, CTA, trust signals, province selector
- [x] Build multi-step wizard (`/assess`) — Step 1: Lead capture (name, email, phone, address with autocomplete, consent checkbox)
- [x] Build multi-step wizard (`/assess`) — Step 2: Purchase information (price, year, down payment, mortgage details)
- [x] Build multi-step wizard (`/assess`) — Step 3: Property details (type, bedrooms, bathrooms, sqft, condo fees, taxes, renovations)
- [x] Build multi-step wizard (`/assess`) — Step 4: Homeowner goals (selling reasons, timeline, move destination)
- [x] Implement server-side financial calculation engine (mortgage amortization, equity, selling costs, capital gains, carrying costs, net gain/loss)
- [x] Build API route `POST /api/assess` — validate inputs, save lead + assessment to Supabase, run calculations, call Claude API, return result
- [x] Integrate Claude API for sell/hold recommendation with structured JSON output and decision-engine prompt
- [x] Build result page (`/result/[id]`) — verdict display (SELL/NOT_SELL), confidence indicator, financial breakdown table, AI reasoning bullets, CTAs

## Medium Priority
- [x] Add Canadian-specific validation (phone +1, postal code format, province auto-fill from address)
- [x] Implement capital gains tax logic with principal residence exemption (full and partial)
- [x] Implement mortgage penalty estimation (variable: 3 months interest; fixed: max of 3 months or IRD)
- [x] Build API route `GET /api/result/[id]` — fetch assessment result from Supabase
- [ ] Build API route `GET /api/market-data` — return cached market data by province/city
- [ ] Add animated loading state during AI analysis ("Analyzing your property...", "Checking market conditions...", etc.)
- [ ] Create privacy policy page (`/privacy`) with PIPEDA/PIPA/Quebec Law 25 compliance
- [ ] Create terms of service page (`/terms`)
- [x] Add SEO meta tags, Open Graph cards, and social sharing support
- [x] Implement SearchStrata cross-promotion for condo property types on result page
- [ ] Seed initial market data for major Canadian cities (Toronto, Vancouver, Calgary, Montreal, Ottawa, etc.)
- [ ] Seed current Bank of Canada interest rates

## Low Priority
- [ ] Add form abandonment tracking (which wizard step users drop off)
- [ ] Add analytics event tracking (page views, CTA clicks, wizard steps, result views)
- [ ] Implement WCAG 2.1 AA accessibility audit and fixes
- [ ] Add "Download PDF report" CTA on result page (Phase 2 prep)
- [ ] Add "Connect with a local agent" lead handoff CTA
- [ ] Add "Share this tool" social sharing functionality
- [ ] Implement lead scoring based on timeline, selling reason, and verdict
- [ ] Performance optimization (< 5 second result generation target)
- [ ] Error boundary and fallback UI for API failures
- [ ] Responsive design polish and cross-browser testing

## Completed
- [x] Project initialization
- [x] Ralph configuration and PRD conversion
- [x] Set up layout.tsx with SellOrNotSell branding, metadata, and OG tags
- [x] Set up globals.css with brand color palette (primary, accent, sell/hold, muted, border)
- [x] Build landing page (`/`) with hero, CTA, how-it-works, "What You Get", trust signals, province selector, footer
- [x] Create shared TypeScript types (LeadInfo, PurchaseInfo, PropertyDetails, HomeownerGoals, AssessmentInput, AssessmentResult, FinancialBreakdown, DB types)
- [x] Build multi-step wizard (`/assess`) with all 4 steps, step indicator, validation, and submit handler
- [x] Implement financial calculation engine with Canadian mortgage math (semi-annual compounding), equity, selling costs, capital gains (PRE + partial exemption + 2024 inclusion rate changes), mortgage penalties (variable + fixed IRD), carrying costs, break-even analysis

## Notes
- This is a Phase 1 MVP — focus on core flow: landing -> wizard -> AI result
- Shares Supabase instance with SearchStrata — leads table schema must match shared spec
- All Claude API and Supabase service role calls must be server-side only (never expose keys to client)
- All monetary values are in CAD; all validation is Canada-specific
- No user authentication — each assessment is a standalone session
- Market data will be seeded manually for MVP; automated refresh is Phase 2
- Refer to .ralph/specs/requirements.md for detailed technical specifications
