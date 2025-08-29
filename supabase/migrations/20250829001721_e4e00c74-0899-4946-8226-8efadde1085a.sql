-- Fix appointments table RLS policies for better security
-- Drop the current permissive policy and create restrictive policies

-- Drop the existing policy
DROP POLICY "Users can manage their own appointments" ON public.appointments;

-- Create separate restrictive policies for each operation
-- These will be restrictive (default) which means they act as AND conditions

-- Policy for SELECT operations
CREATE POLICY "Users can view their own appointments" ON public.appointments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for INSERT operations
CREATE POLICY "Users can create their own appointments" ON public.appointments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE operations  
CREATE POLICY "Users can update their own appointments" ON public.appointments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for DELETE operations
CREATE POLICY "Users can delete their own appointments" ON public.appointments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Ensure RLS is enabled (should already be enabled, but confirming)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;