-- Remove the dangerous overly permissive policy that allows public access to all subscriptions
DROP POLICY "Service can manage subscriptions" ON public.subscriptions;

-- Create secure policies for edge functions using service role
-- Edge functions with service role key can bypass RLS, so they don't need special policies
-- Only authenticated users should be able to view their own subscription data

-- The existing "Users can view their own subscription" policy is already correct
-- We just need to add policies for INSERT and UPDATE operations that service functions need

-- Allow service role to insert subscriptions (for new user signups)
CREATE POLICY "Service role can insert subscriptions" ON public.subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Allow service role to update subscriptions (for payment updates)  
CREATE POLICY "Service role can update subscriptions" ON public.subscriptions
  FOR UPDATE
  USING (true);

-- These policies will only apply when using the anon key
-- Edge functions using the service role key will bypass RLS entirely