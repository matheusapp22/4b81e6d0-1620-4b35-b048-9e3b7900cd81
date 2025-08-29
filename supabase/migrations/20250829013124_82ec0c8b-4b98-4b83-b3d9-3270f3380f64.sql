-- Allow public access to view profiles for bio links
CREATE POLICY "Allow public access to profiles for bio links" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Allow public access to view services for bio links  
CREATE POLICY "Allow public access to services for bio links"
ON public.services
FOR SELECT
USING (is_active = true);

-- Allow public access to view business hours for bio links
CREATE POLICY "Allow public access to business hours for bio links"
ON public.business_hours
FOR SELECT
USING (true);