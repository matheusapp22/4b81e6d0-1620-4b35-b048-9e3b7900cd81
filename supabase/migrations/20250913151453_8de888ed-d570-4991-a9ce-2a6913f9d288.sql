-- Enable Row Level Security on public_profiles table
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (anyone can view public profiles)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.public_profiles 
FOR SELECT 
USING (true);

-- Policy for users to manage their own public profiles
CREATE POLICY "Users can manage their own public profile" 
ON public.public_profiles 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Add comment to document the security model
COMMENT ON TABLE public.public_profiles IS 'Public business profiles - readable by everyone, editable only by owners';