-- Remover a view public_profiles existente que pode ter problemas de segurança
DROP VIEW IF EXISTS public.public_profiles;

-- Recriar a view sem SECURITY DEFINER (usando SECURITY INVOKER por padrão)
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

-- Adicionar comentário explicando que a view é segura
COMMENT ON VIEW public.public_profiles IS 'Public view of profile data for bio links - uses invoker security model';