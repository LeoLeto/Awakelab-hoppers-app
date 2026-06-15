-- Hoppers Community Database Schema
-- Run this in your Supabase SQL editor

-- SAP Profiles reference table
CREATE TABLE IF NOT EXISTS sap_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('functional', 'technical', 'management')),
  module TEXT,
  description_es TEXT,
  required_skills JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  demand_level TEXT CHECK (demand_level IN ('critical', 'high', 'medium', 'low')),
  migration_relevance TEXT CHECK (migration_relevance IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Salary benchmarks
CREATE TABLE IF NOT EXISTS salary_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL CHECK (region IN ('europe', 'latam', 'usa')),
  country TEXT NOT NULL,
  city TEXT,
  role TEXT NOT NULL,
  seniority TEXT NOT NULL CHECK (seniority IN ('junior', 'mid', 'senior', 'architect')),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('permanent', 'freelance')),
  salary_min INTEGER NOT NULL,
  salary_max INTEGER NOT NULL,
  salary_currency TEXT NOT NULL,
  daily_rate_min INTEGER,
  daily_rate_max INTEGER,
  certification_bonus_pct DECIMAL(5,2),
  source TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market insights (weekly snapshots)
CREATE TABLE IF NOT EXISTS market_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  profile_slug TEXT REFERENCES sap_profiles(slug),
  job_postings_count INTEGER,
  demand_trend TEXT CHECK (demand_trend IN ('up', 'down', 'stable')),
  demand_change_pct DECIMAL(5,2),
  avg_salary INTEGER,
  top_skills JSONB DEFAULT '[]',
  source_urls JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  country TEXT,
  city TEXT,
  current_role TEXT,
  years_experience INTEGER,
  sap_modules JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  linkedin_url TEXT,
  target_role TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Public read access to salary benchmarks and profiles
ALTER TABLE salary_benchmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read salary benchmarks"
  ON salary_benchmarks FOR SELECT
  TO anon, authenticated
  USING (true);

ALTER TABLE sap_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sap profiles"
  ON sap_profiles FOR SELECT
  TO anon, authenticated
  USING (true);

ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read market insights"
  ON market_insights FOR SELECT
  TO anon, authenticated
  USING (true);

-- Indexes
CREATE INDEX idx_salary_country ON salary_benchmarks(country);
CREATE INDEX idx_salary_role ON salary_benchmarks(role);
CREATE INDEX idx_salary_seniority ON salary_benchmarks(seniority);
CREATE INDEX idx_market_week ON market_insights(week_start);
CREATE INDEX idx_market_country ON market_insights(country);

-- Trigger to auto-update user_profiles.updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
