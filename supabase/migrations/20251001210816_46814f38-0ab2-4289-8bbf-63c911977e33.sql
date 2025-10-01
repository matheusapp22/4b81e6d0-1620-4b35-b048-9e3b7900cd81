-- CRITICAL: Revoke all grants to anon on profiles table
-- This prevents direct access to PII (email, phone, names)
REVOKE ALL ON public.profiles FROM anon;

-- Keep authenticated users' grants for RLS to work
-- (they still need the grant, RLS further restricts to their own data)

-- Verify public_profiles view retains its grants
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Add security documentation
COMMENT ON TABLE public.profiles IS 
  'SECURITY: Contains PII (email, phone, first_name, last_name). Direct table access is restricted - anonymous users CANNOT query this table. Public access is ONLY via public_profiles view which excludes PII. Authenticated users can only view their own profile via RLS policy.';
