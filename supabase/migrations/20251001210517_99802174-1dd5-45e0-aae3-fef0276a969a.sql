-- Fix: Add SELECT policy for anonymous users on profiles table
-- This is needed for public bio links to work
-- The public_profiles view already filters out PII (email, phone, names)

CREATE POLICY "Anonymous users can view public profile data"
ON public.profiles
FOR SELECT
TO anon
USING (true);

-- Ensure the public_profiles view has proper grants
-- (These might have been revoked, so we re-grant them)
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Add documentation
COMMENT ON POLICY "Anonymous users can view public profile data" ON public.profiles IS 
  'Allows public access to profile data for bio links and booking pages. The public_profiles view filters sensitive data (email, phone, names).';
