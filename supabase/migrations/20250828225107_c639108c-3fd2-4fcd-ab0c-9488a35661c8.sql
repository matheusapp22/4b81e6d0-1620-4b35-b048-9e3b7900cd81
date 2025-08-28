-- Fix security warnings: Set security definer search path for functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Create default business hours (9 AM to 6 PM, Monday to Friday)
  INSERT INTO public.business_hours (user_id, day_of_week, start_time, end_time, is_working)
  VALUES 
    (NEW.id, 1, '09:00', '18:00', true), -- Monday
    (NEW.id, 2, '09:00', '18:00', true), -- Tuesday
    (NEW.id, 3, '09:00', '18:00', true), -- Wednesday
    (NEW.id, 4, '09:00', '18:00', true), -- Thursday
    (NEW.id, 5, '09:00', '18:00', true), -- Friday
    (NEW.id, 6, '09:00', '18:00', false), -- Saturday (closed)
    (NEW.id, 0, '09:00', '18:00', false); -- Sunday (closed)
  
  -- Create default subscription (free plan)
  INSERT INTO public.subscriptions (user_id, plan_type, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$;