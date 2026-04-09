-- Seed market data for major Canadian cities (approximate Q1 2026 values)

INSERT INTO market_data (province, city, avg_price, median_price, avg_days_on_market, price_change_yoy)
VALUES
  -- Ontario
  ('Ontario', 'Toronto', 1085000, 1020000, 22, 2.1),
  ('Ontario', 'Ottawa', 685000, 645000, 28, 3.5),
  ('Ontario', 'Hamilton', 780000, 730000, 25, 1.8),
  ('Ontario', 'Mississauga', 950000, 895000, 24, 1.5),
  ('Ontario', 'Brampton', 920000, 870000, 26, 1.2),
  ('Ontario', 'London', 580000, 545000, 30, 4.2),
  ('Ontario', 'Kitchener', 680000, 640000, 27, 3.0),
  -- British Columbia
  ('British Columbia', 'Vancouver', 1250000, 1150000, 20, 1.8),
  ('British Columbia', 'Victoria', 890000, 835000, 25, 2.5),
  ('British Columbia', 'Kelowna', 750000, 700000, 32, 0.5),
  ('British Columbia', 'Surrey', 1050000, 980000, 22, 2.0),
  -- Alberta
  ('Alberta', 'Calgary', 590000, 550000, 24, 8.5),
  ('Alberta', 'Edmonton', 420000, 395000, 35, 5.2),
  ('Alberta', 'Red Deer', 370000, 345000, 40, 4.0),
  -- Quebec
  ('Quebec', 'Montreal', 580000, 535000, 30, 5.8),
  ('Quebec', 'Quebec City', 380000, 350000, 35, 6.2),
  ('Quebec', 'Gatineau', 450000, 420000, 28, 4.5),
  -- Manitoba
  ('Manitoba', 'Winnipeg', 380000, 350000, 35, 3.5),
  -- Saskatchewan
  ('Saskatchewan', 'Saskatoon', 380000, 355000, 38, 2.8),
  ('Saskatchewan', 'Regina', 340000, 315000, 42, 1.5),
  -- Atlantic
  ('Nova Scotia', 'Halifax', 520000, 480000, 22, 7.5),
  ('New Brunswick', 'Moncton', 350000, 320000, 28, 9.0),
  ('New Brunswick', 'Saint John', 310000, 285000, 35, 6.5),
  ('Newfoundland and Labrador', 'St. John''s', 320000, 295000, 45, 2.0),
  ('Prince Edward Island', 'Charlottetown', 420000, 390000, 30, 5.0)
ON CONFLICT (province, city) DO UPDATE SET
  avg_price = EXCLUDED.avg_price,
  median_price = EXCLUDED.median_price,
  avg_days_on_market = EXCLUDED.avg_days_on_market,
  price_change_yoy = EXCLUDED.price_change_yoy,
  updated_at = now();

-- Seed current Bank of Canada interest rates (approximate April 2026)

INSERT INTO bank_rates (rate_type, rate, effective_date)
VALUES
  ('prime', 5.45, '2026-04-01'),
  ('fixed_5yr', 4.79, '2026-04-01'),
  ('variable', 5.20, '2026-04-01')
ON CONFLICT (rate_type, effective_date) DO UPDATE SET
  rate = EXCLUDED.rate,
  updated_at = now();
