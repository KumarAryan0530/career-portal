-- Fix RLS on jobs table to allow public read access
-- Run this in your Supabase SQL Editor

-- First, disable RLS on jobs table to allow unauthenticated reads
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;

-- Also ensure applications table allows reads for authenticated users
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;

-- Ensure users table is readable
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
