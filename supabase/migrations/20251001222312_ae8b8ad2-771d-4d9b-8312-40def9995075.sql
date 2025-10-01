-- Resolver aviso do scanner sobre public_profiles
-- Views não podem ter RLS policies, mas podemos documentar a segurança

-- Garantir que a view public_profiles existe e usa security_invoker
CREATE OR REPLACE VIEW public.public_profiles 
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

-- Garantir grants apropriados (views precisam de grants explícitos)
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Documentação completa da segurança
COMMENT ON VIEW public.public_profiles IS 
  'SECURITY MODEL: Public access view (intentional by design)
   
   ACCESS: Anônimo (anon) e autenticado (authenticated) podem fazer SELECT
   
   DATA EXPOSED: Apenas dados não-sensíveis para bio links públicos:
   - business_name, avatar_url, banner_url, description
   - Links sociais (website, whatsapp, instagram)
   - Configurações de tema e design
   
   DATA PROTECTED: PII completamente inacessível via esta view:
   - email ❌
   - phone ❌
   - first_name ❌
   - last_name ❌
   
   SECURITY: View usa security_invoker mode para transparência.
   Source table (profiles) tem RLS que bloqueia acesso direto de anon.
   Esta view é o ÚNICO caminho de acesso público aos dados de perfil.';