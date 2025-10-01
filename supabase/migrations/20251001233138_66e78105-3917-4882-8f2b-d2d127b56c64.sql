-- Drop triggers that use pg_net extension
DROP TRIGGER IF EXISTS on_appointment_created ON appointments;
DROP TRIGGER IF EXISTS on_appointment_cancelled ON appointments;

-- Recreate the function without using pg_net
CREATE OR REPLACE FUNCTION public.notify_appointment_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log the appointment creation for future notification processing
  -- Removing net.http_post call that requires pg_net extension
  RAISE NOTICE 'Appointment created: %', NEW.id;
  RETURN NEW;
END;
$function$;

-- Recreate trigger
CREATE TRIGGER on_appointment_created
  AFTER INSERT ON appointments
  FOR EACH ROW
  WHEN (NEW.status = 'scheduled')
  EXECUTE FUNCTION notify_appointment_creation();