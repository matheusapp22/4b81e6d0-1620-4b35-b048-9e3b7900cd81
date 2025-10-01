-- Better security pattern: Use security_invoker with column-level grants
-- This respects RLS while limiting what columns anonymous users can see

-- Step 1: Enable security_invoker on the view
ALTER VIEW public.public_profiles SET (security_invoker = on);

-- Step 2: Grant SELECT on specific non-PII columns only to anon
-- Anonymous users can ONLY see these columns, not email/phone/names
GRANT SELECT (
  user_id,
  business_name,
  avatar_url,
  banner_url,
  description,
  website_link,
  whatsapp_link,
  instagram_link,
  timezone,
  language,
  background_color,
  background_gradient_start,
  background_gradient_end,
  use_gradient_background,
  card_background_color,
  card_border_color,
  primary_color,
  secondary_color,
  accent_color,
  text_primary_color,
  text_secondary_color,
  button_background_color,
  button_text_color,
  section_header_color,
  font_family,
  font_size,
  font_color,
  border_radius,
  shadow_intensity
) ON public.profiles TO anon;

-- Step 3: Add RLS policy for anonymous to read (limited to granted columns)
CREATE POLICY "Anonymous can view public profile columns"
ON public.profiles
FOR SELECT
TO anon
USING (true);

-- Update documentation
COMMENT ON TABLE public.profiles IS 
  'SECURITY: Contains PII (email, phone, first_name, last_name) in restricted columns. Anonymous users have column-level SELECT grants on public fields only. Authenticated users can view their own full profile via RLS.';

COMMENT ON VIEW public.public_profiles IS 
  'Public-facing profile data using security_invoker mode. Anonymous access is controlled via column-level grants on the underlying profiles table, ensuring PII (email, phone, names) remains inaccessible.';
