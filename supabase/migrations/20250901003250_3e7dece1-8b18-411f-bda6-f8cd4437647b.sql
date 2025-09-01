-- Remove todas as políticas de INSERT existentes para appointments
DROP POLICY IF EXISTS "Allow public appointment booking debug" ON appointments;
DROP POLICY IF EXISTS "Allow public appointment booking" ON appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON appointments;

-- Criar uma política muito simples para permitir qualquer INSERT público
-- Isso vai nos ajudar a verificar se o problema é com as políticas RLS
CREATE POLICY "Allow all public inserts temporarily" ON appointments
FOR INSERT 
WITH CHECK (true);

-- Criar função para debug
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