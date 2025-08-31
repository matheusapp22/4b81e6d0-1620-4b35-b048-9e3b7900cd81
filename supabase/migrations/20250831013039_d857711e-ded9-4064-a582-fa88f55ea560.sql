-- Remove the overly permissive public access policy
DROP POLICY IF EXISTS "Allow public access to profiles for bio links" ON public.profiles;

-- Create a more restrictive policy that only exposes necessary fields for bio links
-- This policy allows public access to view profiles but with field-level restrictions
CREATE POLICY "Public bio link access to safe profile fields" ON public.profiles
FOR SELECT 
USING (true);

-- Since we can't restrict specific columns in RLS policies directly,
-- we need to create a view for public bio link access
CREATE OR REPLACE VIEW public.public_profiles AS
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

-- Allow public access to the safe view
ALTER TABLE public.public_profiles OWNER TO postgres;
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Update the main profiles table policy to be more restrictive
-- Remove the public access and keep only authenticated user access
DROP POLICY IF EXISTS "Public bio link access to safe profile fields" ON public.profiles;

-- Only allow users to see their own full profile data
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT 
USING (auth.uid() = user_id);

-- Keep the existing policies for insert and update
-- (Users can insert and update their own profile)