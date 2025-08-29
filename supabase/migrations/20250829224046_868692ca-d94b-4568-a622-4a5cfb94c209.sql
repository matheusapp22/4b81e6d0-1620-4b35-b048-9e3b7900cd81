-- Add new fields to profiles table for biolink customization
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp_link text,
ADD COLUMN IF NOT EXISTS instagram_link text,
ADD COLUMN IF NOT EXISTS font_color text DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS description text;