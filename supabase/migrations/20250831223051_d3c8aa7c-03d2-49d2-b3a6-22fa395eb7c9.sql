-- Allow public booking for biolink appointments
-- This allows anonymous users to create appointments for business owners
CREATE POLICY "Allow public booking for appointments" 
ON public.appointments 
FOR INSERT 
TO anon
WITH CHECK (true);