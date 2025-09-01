-- Temporariamente simplificar a política para debug
DROP POLICY IF EXISTS "Allow public appointment booking" ON appointments;

-- Criar uma política mais permissiva temporariamente para testar
CREATE POLICY "Allow public appointment booking debug" ON appointments
FOR INSERT 
WITH CHECK (
  -- Verificação mais simples primeiro - apenas verificar se o user_id existe em profiles
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = appointments.user_id
  )
);

-- Adicionar logs para debug - vamos ver o que está chegando
-- Vou criar uma function que faz o debug das políticas
CREATE OR REPLACE FUNCTION debug_appointment_policy(
  p_user_id uuid,
  p_service_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_exists boolean;
  service_exists boolean;
  service_active boolean;
  service_owner_match boolean;
  result jsonb;
BEGIN
  -- Check profile exists
  SELECT EXISTS(SELECT 1 FROM profiles WHERE user_id = p_user_id) INTO profile_exists;
  
  -- Check service exists
  SELECT EXISTS(SELECT 1 FROM services WHERE id = p_service_id) INTO service_exists;
  
  -- Check service is active
  SELECT is_active FROM services WHERE id = p_service_id INTO service_active;
  
  -- Check service owner matches user
  SELECT EXISTS(
    SELECT 1 FROM services 
    WHERE id = p_service_id AND user_id = p_user_id
  ) INTO service_owner_match;
  
  result := jsonb_build_object(
    'profile_exists', profile_exists,
    'service_exists', service_exists,
    'service_active', service_active,
    'service_owner_match', service_owner_match
  );
  
  RETURN result;
END;
$$;