-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow public biolink appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON appointments;

-- Create a new policy that allows public booking for biolinks
-- This policy allows anyone to create appointments as long as:
-- 1. The user_id corresponds to a valid profile (business owner)
-- 2. The service_id corresponds to an active service owned by that user
CREATE POLICY "Allow public appointment booking" ON appointments
FOR INSERT 
WITH CHECK (
  -- Verify the user_id exists in profiles (business owner)
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = appointments.user_id
  ) 
  AND 
  -- Verify the service exists, is active and belongs to the user
  EXISTS (
    SELECT 1 FROM services s 
    WHERE s.id = appointments.service_id 
    AND s.user_id = appointments.user_id 
    AND s.is_active = true
  )
);

-- Create policy for authenticated users to create their own appointments
CREATE POLICY "Users can create their own appointments" ON appointments
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM services s 
    WHERE s.id = appointments.service_id 
    AND s.user_id = appointments.user_id 
    AND s.is_active = true
  )
);