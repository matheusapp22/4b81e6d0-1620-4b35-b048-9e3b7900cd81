-- Fix: Restrict public access to profiles table to prevent PII exposure
-- Remove the overly permissive public SELECT policy that exposes email, phone, names

-- Drop the dangerous public policy
DROP POLICY IF EXISTS "Public can view bio link profile fields only" ON public.profiles;

-- Keep policies for authenticated users to manage their own data
-- (these already exist and are secure)

-- Add a comment explaining why we removed public access
COMMENT ON TABLE public.profiles IS 
  'User profile data with PII. Public access should use public_profiles view instead to avoid exposing sensitive data like email, phone, first_name, last_name.';

-- Ensure the public_profiles view has proper access
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;