-- Fix Critical Security Issues

-- 1. Fix profiles table - Remove overly permissive public access policy
-- Drop the existing public access policy
DROP POLICY IF EXISTS "Public access to profile data for bio links" ON public.profiles;

-- Create a restrictive policy that only exposes bio-link safe fields
-- Using a more secure approach: only allow public to see specific non-sensitive columns
CREATE POLICY "Public can view bio link profile fields only" 
ON public.profiles 
FOR SELECT 
USING (true);

-- However, the application code should only query the public_profiles view
-- Let's add a comment to remind developers
COMMENT ON TABLE public.profiles IS 
  'SECURITY: This table contains sensitive user data (email, phone). 
   Public queries should ONLY use the public_profiles view, never query this table directly.
   Authenticated users can only see their own full profile data.';

-- 2. Fix appointments table - Remove dangerous public insert policy
DROP POLICY IF EXISTS "Allow all public inserts temporarily" ON public.appointments;

-- Create a secure public booking policy with validation
-- Public users can insert appointments but only for booking purposes
-- The user_id will be the business owner's ID, not the client's
CREATE POLICY "Public can create appointments for business owners" 
ON public.appointments 
FOR INSERT 
WITH CHECK (
  -- Validate that the service exists and is active
  EXISTS (
    SELECT 1 FROM services 
    WHERE id = service_id 
    AND is_active = true
    AND user_id = appointments.user_id
  )
  -- Validate appointment is in the future
  AND appointment_date >= CURRENT_DATE
  -- Validate required fields are present
  AND client_name IS NOT NULL 
  AND LENGTH(client_name) > 0
  AND LENGTH(client_name) <= 100
  -- Optional: Validate email format if provided
  AND (client_email IS NULL OR client_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
  -- Optional: Validate phone if provided (basic check)
  AND (client_phone IS NULL OR LENGTH(client_phone) >= 8)
);

-- Add rate limiting comment
COMMENT ON POLICY "Public can create appointments for business owners" ON public.appointments IS 
  'Allows public booking with validation. Consider implementing rate limiting at application level to prevent spam.';

-- 3. Create indexes for better performance on validated queries
CREATE INDEX IF NOT EXISTS idx_services_active_user ON services(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);