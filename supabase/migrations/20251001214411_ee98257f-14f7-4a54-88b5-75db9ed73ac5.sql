-- CORREÇÃO FINAL: Remover completamente o acesso anônimo à tabela profiles
-- Scanner de segurança detecta a policy mesmo com column-level protection

-- Remover policy anônima
DROP POLICY IF EXISTS "Anonymous can view public columns only" ON public.profiles;

-- Remover grants de colunas para anon (segurança em camadas)
REVOKE ALL ON public.profiles FROM anon;

-- Garantir que a view pública continua acessível
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Garantir que authenticated users ainda podem ver seus próprios dados completos
-- (já existe policy, mas vamos garantir o grant)
GRANT SELECT ON public.profiles TO authenticated;

-- Documentação final
COMMENT ON TABLE public.profiles IS 
  'SECURITY LOCKED: Contains PII (email, phone, first_name, last_name). 
   ZERO direct access for anonymous users - NO policies, NO grants.
   Authenticated users can only view their own profile via RLS policy.
   Public access is EXCLUSIVELY through public_profiles view which exposes only non-PII data.';

COMMENT ON VIEW public.public_profiles IS 
  'PUBLIC ACCESS POINT: Only way for anonymous users to access profile data.
   Uses security_invoker mode and exposes ONLY non-PII columns.
   PII (email, phone, names) is completely inaccessible to anonymous users.';
