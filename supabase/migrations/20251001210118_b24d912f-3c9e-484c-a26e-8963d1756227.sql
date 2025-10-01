-- Fix: Add SELECT policy to profiles table so users can view their own data
-- This is required for the public_profiles view to work properly
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a security barrier view (recreate with security_barrier option)
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles
WITH (security_barrier = true)
AS
SELECT 
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
FROM public.profiles;

-- Ensure proper access grants for the view
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Add documentation
COMMENT ON VIEW public.public_profiles IS 
  'Public-facing profile data for bio links and booking pages. Excludes PII (email, phone, first_name, last_name). Access controlled via underlying profiles table RLS policies + explicit grants.';
