-- Create bio_links table for managing multiple saved bio links
CREATE TABLE public.bio_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  slug TEXT NOT NULL,
  avatar_url TEXT,
  banner_url TEXT,
  business_name TEXT,
  description TEXT,
  whatsapp_link TEXT,
  instagram_link TEXT,
  website_link TEXT,
  -- Theme configuration
  background_color TEXT DEFAULT '#1a1a2e',
  background_gradient_start TEXT DEFAULT '#16213e',
  background_gradient_end TEXT DEFAULT '#0f172a',
  use_gradient_background BOOLEAN DEFAULT true,
  card_background_color TEXT DEFAULT 'rgba(255,255,255,0.1)',
  card_border_color TEXT DEFAULT 'rgba(255,255,255,0.2)',
  primary_color TEXT DEFAULT '#6366f1',
  secondary_color TEXT DEFAULT '#8b5cf6',
  accent_color TEXT DEFAULT '#06b6d4',
  text_primary_color TEXT DEFAULT '#ffffff',
  text_secondary_color TEXT DEFAULT 'rgba(255,255,255,0.8)',
  button_background_color TEXT DEFAULT '#10b981',
  button_text_color TEXT DEFAULT '#ffffff',
  section_header_color TEXT DEFAULT '#ffffff',
  font_family TEXT DEFAULT 'Inter',
  font_size TEXT DEFAULT 'medium',
  font_color TEXT DEFAULT '#ffffff',
  border_radius TEXT DEFAULT 'medium',
  shadow_intensity TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bio_links ENABLE ROW LEVEL SECURITY;

-- Create policies for bio_links
CREATE POLICY "Users can manage their own bio links" 
ON public.bio_links 
FOR ALL 
USING (auth.uid() = user_id);

-- Create testimonials table for photo testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bio_link_id UUID REFERENCES public.bio_links(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  client_name TEXT,
  description TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials
CREATE POLICY "Users can manage their own testimonials" 
ON public.testimonials 
FOR ALL 
USING (auth.uid() = user_id);

-- Allow public access to active testimonials for bio links
CREATE POLICY "Public can view active testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_active = true);

-- Create storage bucket for testimonials
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true);

-- Create storage policies for testimonials
CREATE POLICY "Users can upload testimonial images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'testimonials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view testimonial images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'testimonials');

CREATE POLICY "Users can update their own testimonial images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'testimonials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own testimonial images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'testimonials' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add unique constraint for active bio link per user
CREATE UNIQUE INDEX idx_bio_links_user_active ON public.bio_links (user_id) WHERE is_active = true;

-- Add index for slug lookup
CREATE UNIQUE INDEX idx_bio_links_slug ON public.bio_links (slug);

-- Create trigger for updated_at
CREATE TRIGGER update_bio_links_updated_at
BEFORE UPDATE ON public.bio_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();