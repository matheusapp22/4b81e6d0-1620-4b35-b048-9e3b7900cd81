-- Criar função para notificar cancelamento de agendamento
CREATE OR REPLACE FUNCTION notify_appointment_cancellation()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para notificação de cancelamento
DROP TRIGGER IF EXISTS trigger_appointment_cancellation ON appointments;
CREATE TRIGGER trigger_appointment_cancellation
  AFTER UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION notify_appointment_cancellation();