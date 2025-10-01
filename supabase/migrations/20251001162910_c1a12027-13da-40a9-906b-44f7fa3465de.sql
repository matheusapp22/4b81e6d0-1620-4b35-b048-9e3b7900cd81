
-- Fix Security Definer View issue
-- The public_profiles view should use SECURITY INVOKER mode (default)
-- to ensure it respects the querying user's RLS policies

-- Drop the existing view
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Recreate the view without any security definer properties
-- By default, views use SECURITY INVOKER mode which is what we want
CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
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

-- Grant explicit access to public roles
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Add helpful comment
COMMENT ON VIEW public.public_profiles IS 
  'Public view of profile data for bio links. Uses SECURITY INVOKER mode to respect RLS policies of the querying user, not the view creator.';
