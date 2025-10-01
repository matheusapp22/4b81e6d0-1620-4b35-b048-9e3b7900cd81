-- Fix: Enable security_invoker on public_profiles view
-- This makes the view respect RLS policies instead of bypassing them

ALTER VIEW public.public_profiles SET (security_invoker = on);

-- Confirm the fix with a comment
COMMENT ON VIEW public.public_profiles IS 
  'Public view exposing non-sensitive profile data for bio links. Excludes PII (email, phone, names). Uses security_invoker to respect RLS policies. Accessible to all users via explicit grants.';
