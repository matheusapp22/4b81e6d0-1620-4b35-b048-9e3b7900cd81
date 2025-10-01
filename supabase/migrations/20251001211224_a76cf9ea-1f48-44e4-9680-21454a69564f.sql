-- IMPROVED SECURITY: Remove anonymous policy from profiles table
-- Anonymous users should ONLY access data through the public_profiles view
-- This follows the principle of least privilege

-- Step 1: Drop the anonymous SELECT policy
DROP POLICY IF EXISTS "Anonymous can view public profile columns" ON public.profiles;

-- Step 2: Revoke column-level grants (no longer needed without policy)
REVOKE SELECT ON public.profiles FROM anon;

-- Step 3: Switch public_profiles view back to security_definer mode
-- This is the CORRECT pattern: view runs with elevated permissions
-- but only exposes non-PII columns to anonymous users
ALTER VIEW public.public_profiles SET (security_invoker = off);

-- Step 4: Ensure view grants remain
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Final documentation
COMMENT ON TABLE public.profiles IS 
  'SECURITY: Contains PII (email, phone, first_name, last_name). NO direct access for anonymous users. Public access is ONLY through public_profiles view which filters out PII. Authenticated users can view their own data via RLS.';

COMMENT ON VIEW public.public_profiles IS 
  'SECURITY: Uses security_definer mode to safely expose non-PII profile data. Anonymous users access business profiles through this view ONLY, never directly querying the profiles table. This is the standard PostgreSQL pattern for column-filtering security.';
