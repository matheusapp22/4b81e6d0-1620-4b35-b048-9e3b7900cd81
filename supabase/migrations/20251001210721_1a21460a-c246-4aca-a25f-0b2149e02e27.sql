-- CRITICAL FIX: Remove the dangerous anonymous SELECT policy
-- This policy exposes PII (email, phone, names) to anyone
DROP POLICY IF EXISTS "Anonymous users can view public profile data" ON public.profiles;

-- Change public_profiles view back to security_definer mode (default)
-- This is the CORRECT pattern for exposing a filtered subset of columns
-- The view will run with elevated permissions but only return non-PII columns
ALTER VIEW public.public_profiles SET (security_invoker = off);

-- Ensure explicit grants remain for the view
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Update documentation to explain the security model
COMMENT ON VIEW public.public_profiles IS 
  'SECURITY MODEL: This view uses security_definer mode to safely expose non-PII profile data. Anonymous users can query this view for bio links, but the underlying profiles table with PII (email, phone, names) is protected by RLS and NOT accessible to anonymous users.';

COMMENT ON TABLE public.profiles IS 
  'Contains user PII including email, phone, first_name, last_name. Protected by RLS - only authenticated users can view their own data. Public access should ONLY use the public_profiles view which excludes PII.';
