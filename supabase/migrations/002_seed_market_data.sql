-- Seed market data for major Canadian cities (approximate 2026 values)
-- Sources: CREA, local real estate boards — values are estimates for MVP

INSERT INTO market_data (province, city, avg_price, median_price, avg_days_on_market, price_change_yoy) VALUES
  -- Ontario
  ('Ontario', 'Toronto', 1085000, 1020000, 22, 2.1),
  ('Ontario', 'Ottawa', 685000, 650000, 28, 3.5),
  ('Ontario', 'Hamilton', 785000, 740000, 25, 1.8),
  ('Ontario', 'Kitchener', 720000, 680000, 27, 2.3),
  ('Ontario', 'London', 585000, 550000, 30, 1.5),
  ('Ontario', 'Mississauga', 960000, 910000, 24, 2.0),
  ('Ontario', 'Brampton', 920000, 875000, 23, 1.9),

  -- British Columbia
  ('British Columbia', 'Vancouver', 1250000, 1150000, 20, 1.5),
  ('British Columbia', 'Victoria', 875000, 820000, 26, 2.8),
  ('British Columbia', 'Kelowna', 780000, 720000, 32, 1.2),
  ('British Columbia', 'Surrey', 1050000, 980000, 22, 1.7),
  ('British Columbia', 'Burnaby', 1100000, 1030000, 21, 1.6),

  -- Alberta
  ('Alberta', 'Calgary', 585000, 540000, 24, 5.2),
  ('Alberta', 'Edmonton', 420000, 390000, 35, 4.8),
  ('Alberta', 'Red Deer', 350000, 320000, 40, 3.5),

  -- Quebec
  ('Quebec', 'Montreal', 580000, 530000, 30, 4.5),
  ('Quebec', 'Quebec City', 380000, 350000, 35, 3.8),
  ('Quebec', 'Gatineau', 450000, 420000, 28, 4.0),
  ('Quebec', 'Laval', 550000, 510000, 29, 3.9),

  -- Manitoba
  ('Manitoba', 'Winnipeg', 365000, 340000, 35, 3.0),

  -- Saskatchewan
  ('Saskatchewan', 'Regina', 330000, 310000, 42, 2.0),
  ('Saskatchewan', 'Saskatoon', 370000, 345000, 38, 2.5),

  -- Nova Scotia
  ('Nova Scotia', 'Halifax', 520000, 480000, 22, 5.5),

  -- New Brunswick
  ('New Brunswick', 'Moncton', 340000, 310000, 30, 6.0),
  ('New Brunswick', 'Saint John', 290000, 265000, 38, 4.5),
  ('New Brunswick', 'Fredericton', 320000, 295000, 33, 5.0),

  -- Prince Edward Island
  ('Prince Edward Island', 'Charlottetown', 400000, 370000, 28, 5.5),

  -- Newfoundland and Labrador
  ('Newfoundland and Labrador', 'St. John''s', 310000, 285000, 45, 1.0)
ON CONFLICT (province, city) DO UPDATE SET
  avg_price = EXCLUDED.avg_price,
  median_price = EXCLUDED.median_price,
  avg_days_on_market = EXCLUDED.avg_days_on_market,
  price_change_yoy = EXCLUDED.price_change_yoy,
  updated_at = now();

-- Seed Bank of Canada rates (approximate April 2026 values)
INSERT INTO bank_rates (rate_type, rate, effective_date) VALUES
  ('prime', 5.45, '2026-04-01'),
  ('fixed_5yr', 4.79, '2026-04-01'),
  ('variable', 5.20, '2026-04-01')
ON CONFLICT (rate_type, effective_date) DO UPDATE SET
  rate = EXCLUDED.rate,
  updated_at = now();
