-- Allow public access to active bio links
CREATE POLICY "Public can view active bio links"
ON public.bio_links
FOR SELECT
TO anon, authenticated
USING (is_active = true);