-- Fix Security Definer issues
-- Remove debug function (should not be in production)
DROP FUNCTION IF EXISTS public.debug_appointment_policy(uuid, uuid);

-- Change validate_input to SECURITY INVOKER (doesn't need elevated privileges)
CREATE OR REPLACE FUNCTION public.validate_input(input_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $function$
BEGIN
  -- Verificar se o input contém caracteres perigosos
  IF input_text ~ '[<>"'';&\x00-\x1F\x7F]' THEN
    RETURN false;
  END IF;
  
  -- Verificar tamanho máximo
  IF length(input_text) > 1000 THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;

-- Add comment explaining why other functions need SECURITY DEFINER
COMMENT ON FUNCTION public.handle_new_user() IS 
  'SECURITY DEFINER required: Trigger must insert into multiple tables with RLS policies during user creation';

COMMENT ON FUNCTION public.log_security_event(uuid, text, jsonb, text, text) IS 
  'SECURITY DEFINER required: Must write to security_logs table which has service_role-only RLS policy';

COMMENT ON FUNCTION public.log_auth_attempts() IS 
  'SECURITY DEFINER required: Trigger must call log_security_event to write to protected security_logs table';

COMMENT ON FUNCTION public.log_profile_creation() IS 
  'SECURITY DEFINER required: Trigger must call log_security_event to write to protected security_logs table';

COMMENT ON FUNCTION public.notify_appointment_cancellation() IS 
  'SECURITY DEFINER required: Trigger must access related tables and make external HTTP calls';

COMMENT ON FUNCTION public.notify_appointment_creation() IS 
  'SECURITY DEFINER required: Trigger must access related tables and make external HTTP calls';

COMMENT ON FUNCTION public.update_updated_at_column() IS 
  'SECURITY DEFINER required: Trigger must update timestamps regardless of RLS policies';