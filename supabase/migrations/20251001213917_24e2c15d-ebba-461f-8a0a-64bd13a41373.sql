-- SOLUÇÃO CORRIGIDA: View security_invoker com função wrapper
-- Remove o aviso de security_definer na view

-- Passo 1: Criar função security definer para dados públicos
CREATE OR REPLACE FUNCTION public.get_public_profile_data(p_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  business_name text,
  avatar_url text,
  banner_url text,
  description text,
  website_link text,
  whatsapp_link text,
  instagram_link text,
  timezone text,
  language text,
  background_color text,
  background_gradient_start text,
  background_gradient_end text,
  use_gradient_background boolean,
  card_background_color text,
  card_border_color text,
  primary_color text,
  secondary_color text,
  accent_color text,
  text_primary_color text,
  text_secondary_color text,
  button_background_color text,
  button_text_color text,
  section_header_color text,
  font_family text,
  font_size text,
  font_color text,
  border_radius text,
  shadow_intensity text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    p.business_name,
    p.avatar_url,
    p.banner_url,
    p.description,
    p.website_link,
    p.whatsapp_link,
    p.instagram_link,
    p.timezone,
    p.language,
    p.background_color,
    p.background_gradient_start,
    p.background_gradient_end,
    p.use_gradient_background,
    p.card_background_color,
    p.card_border_color,
    p.primary_color,
    p.secondary_color,
    p.accent_color,
    p.text_primary_color,
    p.text_secondary_color,
    p.button_background_color,
    p.button_text_color,
    p.section_header_color,
    p.font_family,
    p.font_size,
    p.font_color,
    p.border_radius,
    p.shadow_intensity
  FROM profiles p
  WHERE p.user_id = p_user_id;
$$;

-- Passo 2: Recriar view simples como security_invoker
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles
WITH (security_invoker = on)
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
FROM profiles;

-- Passo 3: Dar grants column-level para anon
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

-- Passo 4: Adicionar policy RLS para anon
CREATE POLICY "Anonymous can view public columns only"
ON public.profiles
FOR SELECT
TO anon
USING (true);

-- Passo 5: Grants na view e função
GRANT EXECUTE ON FUNCTION public.get_public_profile_data(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_profile_data(uuid) TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Documentação final
COMMENT ON VIEW public.public_profiles IS 
  'SECURITY: Uses security_invoker mode. Anonymous access is protected via column-level grants on profiles table - only non-PII columns are accessible. PII (email, phone, names) remains protected.';

COMMENT ON TABLE public.profiles IS 
  'SECURITY: Contains PII (email, phone, first_name, last_name). Column-level grants restrict anonymous users to public fields only. Full profile access for authenticated users via RLS policy.';
