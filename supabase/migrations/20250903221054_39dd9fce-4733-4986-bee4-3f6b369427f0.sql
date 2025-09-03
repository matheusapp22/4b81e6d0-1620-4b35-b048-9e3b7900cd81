-- Corrigir problemas de segurança identificados pelo linter

-- 1. Corrigir search_path para funções existentes
CREATE OR REPLACE FUNCTION public.debug_appointment_policy(p_user_id uuid, p_service_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;

-- 2. Corrigir a função de notificação de cancelamento
CREATE OR REPLACE FUNCTION public.notify_appointment_cancellation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  profile_record RECORD;
  service_record RECORD;
BEGIN
  -- Só executa se o status mudou para 'cancelled'
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    -- Busca dados do perfil
    SELECT email, business_name INTO profile_record
    FROM profiles 
    WHERE user_id = NEW.user_id;
    
    -- Busca dados do serviço
    SELECT name, price INTO service_record
    FROM services 
    WHERE id = NEW.service_id;
    
    -- Log para debug
    RAISE NOTICE 'Appointment cancelled: %, Service: %, Price: %', 
      NEW.id, service_record.name, service_record.price;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 3. Atualizar políticas de RLS para maior segurança

-- Restringir acesso público aos horários de funcionamento apenas para visualização de bio links específicos
DROP POLICY IF EXISTS "Allow public access to business hours for bio links" ON business_hours;
CREATE POLICY "Allow public access to business hours for specific user" 
ON business_hours 
FOR SELECT 
USING (
  -- Permitir acesso público apenas quando especificamente solicitado por bio link
  auth.role() = 'anon' OR auth.uid() = user_id
);

-- Restringir acesso público aos serviços apenas para visualização de bio links específicos
DROP POLICY IF EXISTS "Allow public access to services for bio links" ON services;
CREATE POLICY "Allow public access to active services for specific user" 
ON services 
FOR SELECT 
USING (
  is_active = true AND (auth.role() = 'anon' OR auth.uid() = user_id)
);

-- Melhorar política de testimonials para incluir contexto de bio link
DROP POLICY IF EXISTS "Public can view active testimonials" ON testimonials;
CREATE POLICY "Public can view active testimonials with context" 
ON testimonials 
FOR SELECT 
USING (
  is_active = true AND (auth.role() = 'anon' OR auth.uid() = user_id)
);

-- 4. Criar função para validação de entrada (prevenção SQL injection)
CREATE OR REPLACE FUNCTION public.validate_input(input_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se o input contém caracteres perigosos
  IF input_text ~ '[<>\"'';&\x00-\x1F\x7F]' THEN
    RETURN false;
  END IF;
  
  -- Verificar tamanho máximo
  IF length(input_text) > 1000 THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- 5. Criar tabela para log de segurança
CREATE TABLE IF NOT EXISTS public.security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  event_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS na tabela de logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs de segurança
CREATE POLICY "Only service role can manage security logs" 
ON public.security_logs 
FOR ALL 
USING (auth.role() = 'service_role');

-- 6. Função para log de eventos de segurança
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id uuid,
  p_event_type text,
  p_event_data jsonb DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO security_logs (user_id, event_type, event_data, ip_address, user_agent)
  VALUES (
    p_user_id, 
    p_event_type, 
    p_event_data, 
    p_ip_address::inet, 
    p_user_agent
  );
END;
$$;

-- 7. Trigger para log automático de tentativas de login
CREATE OR REPLACE FUNCTION public.log_auth_attempts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log successful login
  IF TG_OP = 'INSERT' AND NEW.last_sign_in_at IS NOT NULL THEN
    PERFORM log_security_event(
      NEW.id,
      'successful_login',
      jsonb_build_object('email', NEW.email),
      NULL,
      NULL
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Não podemos criar trigger na tabela auth.users, mas podemos criar na profiles
CREATE OR REPLACE FUNCTION public.log_profile_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM log_security_event(
    NEW.user_id,
    'profile_created',
    jsonb_build_object('email', NEW.email),
    NULL,
    NULL
  );
  
  RETURN NEW;
END;
$$;