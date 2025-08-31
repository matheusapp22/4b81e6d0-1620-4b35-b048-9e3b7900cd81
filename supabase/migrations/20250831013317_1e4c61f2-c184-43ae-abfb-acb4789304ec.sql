-- Fix the SECURITY DEFINER issue by recreating the view without it
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS
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
  -- Styling fields needed for bio links
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

-- Grant access to the safe view for public use
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;