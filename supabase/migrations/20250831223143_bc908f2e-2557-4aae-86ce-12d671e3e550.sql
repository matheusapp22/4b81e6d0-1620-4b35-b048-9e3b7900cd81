-- Remove the overly permissive policy
DROP POLICY "Allow public booking for appointments" ON public.appointments;

-- Create a more secure policy that allows anonymous users to create appointments
-- but only with proper user_id from business profiles
CREATE POLICY "Allow public biolink appointments" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  -- Check that the user_id exists in profiles table and has services
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = appointments.user_id
  ) AND
  -- Check that the service_id exists and belongs to the user
  EXISTS (
    SELECT 1 
    FROM public.services s 
    WHERE s.id = appointments.service_id 
    AND s.user_id = appointments.user_id
    AND s.is_active = true
  )
);