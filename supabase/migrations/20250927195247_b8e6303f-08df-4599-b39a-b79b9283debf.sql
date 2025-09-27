-- Criar tabela para armazenar inscrições de push notifications
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription JSONB NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política para usuários gerenciarem suas próprias inscrições
CREATE POLICY "Users can manage their own push subscriptions" 
ON public.push_subscriptions 
FOR ALL 
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_push_subscriptions_updated_at
BEFORE UPDATE ON public.push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar trigger para enviar notificações automaticamente quando um agendamento é criado
CREATE OR REPLACE FUNCTION public.notify_appointment_creation()
RETURNS TRIGGER AS $$
DECLARE
  profile_record RECORD;
  service_record RECORD;
BEGIN
  -- Só executa para novos agendamentos (status 'scheduled')
  IF NEW.status = 'scheduled' AND TG_OP = 'INSERT' THEN
    -- Busca dados do perfil
    SELECT email, business_name, first_name, last_name INTO profile_record
    FROM profiles 
    WHERE user_id = NEW.user_id;
    
    -- Busca dados do serviço
    SELECT name, price INTO service_record
    FROM services 
    WHERE id = NEW.service_id;
    
    -- Chama a função edge para enviar notificação
    PERFORM
      net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/send-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
        ),
        body := jsonb_build_object(
          'type', 'appointment_created',
          'businessEmail', profile_record.email,
          'businessName', COALESCE(profile_record.business_name, profile_record.first_name || ' ' || profile_record.last_name),
          'clientName', NEW.client_name,
          'serviceName', service_record.name,
          'appointmentDate', NEW.appointment_date,
          'appointmentTime', NEW.start_time,
          'servicePrice', COALESCE(NEW.payment_amount, service_record.price),
          'clientPhone', NEW.client_phone,
          'clientEmail', NEW.client_email,
          'userId', NEW.user_id
        )
      );
      
    RAISE NOTICE 'Notificação enviada para agendamento: %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar o trigger
DROP TRIGGER IF EXISTS trigger_notify_appointment_creation ON public.appointments;
CREATE TRIGGER trigger_notify_appointment_creation
AFTER INSERT ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.notify_appointment_creation();