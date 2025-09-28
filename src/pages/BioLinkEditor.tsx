import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Clock, Save, Eye, Image as ImageIcon, User, Link2, Copy, Share2, QrCode, Plus, Trash2, Camera, Star } from 'lucide-react';
import { useSubscriptionLimits } from '@/hooks/use-subscription-limits';
import { UpgradePrompt } from '@/components/ui/upgrade-prompt';

interface BusinessHours {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working: boolean;
}

interface BioLink {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

interface Testimonial {
  id: string;
  image_url: string;
  client_name?: string;
  description?: string;
  rating?: number;
  display_order: number;
}

export const BioLinkEditor = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bioLinks, setBioLinks] = useState<BioLink[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({ client_name: '', description: '', rating: 5 });
  const [testimonialFile, setTestimonialFile] = useState<File | null>(null);
  const { 
    limits, 
    usage, 
    canCreateBioLink, 
    canCreateTestimonial, 
    getRemainingCount, 
    refreshUsage 
  } = useSubscriptionLimits();
  const [formData, setFormData] = useState({
    business_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    whatsapp_link: '',
    instagram_link: '',
    website_link: '',
    font_color: '#ffffff',
    description: '',
    background_color: '#1a1a2e',
    background_gradient_start: '#16213e',
    background_gradient_end: '#0f172a',
    card_background_color: 'rgba(255,255,255,0.1)',
    card_border_color: 'rgba(255,255,255,0.2)',
    primary_color: '#6366f1',
    secondary_color: '#8b5cf6',
    accent_color: '#06b6d4',
    text_primary_color: '#ffffff',
    text_secondary_color: 'rgba(255,255,255,0.8)',
    button_background_color: '#10b981',
    button_text_color: '#ffffff',
    section_header_color: '#ffffff',
    font_family: 'Inter',
    font_size: 'medium',
    border_radius: 'medium',
    shadow_intensity: 'medium',
    use_gradient_background: true,
  });

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        whatsapp_link: profile.whatsapp_link || '',
        instagram_link: profile.instagram_link || '',
        website_link: profile.website_link || '',
        font_color: profile.font_color || '#ffffff',
        description: profile.description || '',
        background_color: profile.background_color || '#1a1a2e',
        background_gradient_start: profile.background_gradient_start || '#16213e',
        background_gradient_end: profile.background_gradient_end || '#0f172a',
        card_background_color: profile.card_background_color || 'rgba(255,255,255,0.1)',
        card_border_color: profile.card_border_color || 'rgba(255,255,255,0.2)',
        primary_color: profile.primary_color || '#6366f1',
        secondary_color: profile.secondary_color || '#8b5cf6',
        accent_color: profile.accent_color || '#06b6d4',
        text_primary_color: profile.text_primary_color || '#ffffff',
        text_secondary_color: profile.text_secondary_color || 'rgba(255,255,255,0.8)',
        button_background_color: profile.button_background_color || '#10b981',
        button_text_color: profile.button_text_color || '#ffffff',
        section_header_color: profile.section_header_color || '#ffffff',
        font_family: profile.font_family || 'Inter',
        font_size: profile.font_size || 'medium',
        border_radius: profile.border_radius || 'medium',
        shadow_intensity: profile.shadow_intensity || 'medium',
        use_gradient_background: profile.use_gradient_background ?? true,
      });
    }
  }, [profile]);

  useEffect(() => {
    fetchBusinessHours();
    fetchBioLinks();
    fetchTestimonials();
  }, [user]);

  const fetchBusinessHours = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('user_id', user.id)
        .order('day_of_week');

      if (error) throw error;
      setBusinessHours(data || []);
    } catch (error) {
      console.error('Error fetching business hours:', error);
    }
  };

  const fetchBioLinks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bio_links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBioLinks(data || []);
    } catch (error) {
      console.error('Error fetching bio links:', error);
    }
  };

  const fetchTestimonials = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order');

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const uploadImage = async (file: File, bucket: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!user || !formData.business_name) {
      toast({
        title: "Nome do negócio obrigatório",
        description: "Por favor, preencha o nome do negócio antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = profile?.avatar_url;
      let bannerUrl = profile?.banner_url;

      // Upload avatar if selected
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile, 'avatars');
      }

      // Upload banner if selected
      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, 'banners');
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          business_name: formData.business_name,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          email: formData.email,
          whatsapp_link: formData.whatsapp_link,
          instagram_link: formData.instagram_link,
          website_link: formData.website_link,
          font_color: formData.font_color,
          description: formData.description,
          background_color: formData.background_color,
          background_gradient_start: formData.background_gradient_start,
          background_gradient_end: formData.background_gradient_end,
          card_background_color: formData.card_background_color,
          card_border_color: formData.card_border_color,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          accent_color: formData.accent_color,
          text_primary_color: formData.text_primary_color,
          text_secondary_color: formData.text_secondary_color,
          button_background_color: formData.button_background_color,
          button_text_color: formData.button_text_color,
          section_header_color: formData.section_header_color,
          font_family: formData.font_family,
          font_size: formData.font_size,
          border_radius: formData.border_radius,
          shadow_intensity: formData.shadow_intensity,
          use_gradient_background: formData.use_gradient_background,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Create a new bio link
      // First deactivate all existing bio links
      await supabase
        .from('bio_links')
        .update({ is_active: false })
        .eq('user_id', user.id);

      const { error: bioLinkError } = await supabase
        .from('bio_links')
        .insert({
          user_id: user.id,
          name: `${formData.business_name} - ${new Date().toLocaleDateString('pt-BR')}`,
          slug: formData.business_name,
          is_active: true,
          business_name: formData.business_name,
          description: formData.description,
          whatsapp_link: formData.whatsapp_link,
          instagram_link: formData.instagram_link,
          website_link: formData.website_link,
          background_color: formData.background_color,
          background_gradient_start: formData.background_gradient_start,
          background_gradient_end: formData.background_gradient_end,
          card_background_color: formData.card_background_color,
          card_border_color: formData.card_border_color,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          accent_color: formData.accent_color,
          text_primary_color: formData.text_primary_color,
          text_secondary_color: formData.text_secondary_color,
          button_background_color: formData.button_background_color,
          button_text_color: formData.button_text_color,
          section_header_color: formData.section_header_color,
          font_family: formData.font_family,
          font_size: formData.font_size,
          font_color: formData.font_color,
          border_radius: formData.border_radius,
          shadow_intensity: formData.shadow_intensity,
          use_gradient_background: formData.use_gradient_background,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
        });

      if (bioLinkError) throw bioLinkError;

      await refreshProfile();
      await fetchBioLinks();
      refreshUsage(); // Refresh usage after creating bio link
      
      toast({
        title: "Bio link criado!",
        description: "Suas alterações foram salvas e o bio link foi criado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessHours = async (dayIndex: number, field: keyof BusinessHours, value: any) => {
    const updatedHours = [...businessHours];
    const dayHour = updatedHours.find(h => h.day_of_week === dayIndex);
    
    if (dayHour) {
      (dayHour as any)[field] = value;
      
      try {
        const { error } = await supabase
          .from('business_hours')
          .update({ [field]: value })
          .eq('id', dayHour.id);

        if (error) throw error;
        setBusinessHours(updatedHours);
      } catch (error) {
        console.error('Error updating business hours:', error);
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const shareLink = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${formData.business_name || formData.first_name} - Agendamentos`,
          text: 'Agende seu horário comigo!',
          url: url,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const generateQRCode = (url: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    return qrUrl;
  };

  const createBioLink = async () => {
    if (!user || !formData.business_name) return;

    try {
      setLoading(true);
      
      // First deactivate all existing bio links
      await supabase
        .from('bio_links')
        .update({ is_active: false })
        .eq('user_id', user.id);

      const { error } = await supabase
        .from('bio_links')
        .insert({
          user_id: user.id,
          name: `${formData.business_name} - ${new Date().toLocaleDateString()}`,
          slug: formData.business_name,
          is_active: true,
          ...formData
        });

      if (error) throw error;

      await fetchBioLinks();
      toast({
        title: "Bio Link criado!",
        description: "Seu novo bio link foi salvo e ativado.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBioLink = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        // Deactivate all other bio links first
        await supabase
          .from('bio_links')
          .update({ is_active: false })
          .eq('user_id', user!.id);
      }

      const { error } = await supabase
        .from('bio_links')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      await fetchBioLinks();
      toast({
        title: isActive ? "Bio Link ativado!" : "Bio Link desativado!",
        description: isActive ? "Este bio link agora está ativo." : "Este bio link foi desativado.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteBioLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bio_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchBioLinks();
      toast({
        title: "Bio Link excluído!",
        description: "O bio link foi removido com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyBioLinkUrl = async (slug: string) => {
    const url = `${window.location.origin}/bio/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "O link do bio foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const addTestimonial = async () => {
    if (!user || !testimonialFile) return;

    // Check testimonial limits
    if (!canCreateTestimonial()) {
      toast({
        title: "Limite atingido!",
        description: `Você atingiu o limite de ${limits.testimonials_limit} depoimentos do plano ${limits.plan_type.toUpperCase()}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Upload image
      const imageUrl = await uploadImage(testimonialFile, 'testimonials');

      const { error } = await supabase
        .from('testimonials')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          client_name: newTestimonial.client_name,
          description: newTestimonial.description,
          rating: newTestimonial.rating,
          display_order: testimonials.length
        });

      if (error) throw error;

      await fetchTestimonials();
      refreshUsage(); // Refresh usage after creating testimonial
      setNewTestimonial({ client_name: '', description: '', rating: 5 });
      setTestimonialFile(null);
      
      toast({
        title: "Depoimento adicionado!",
        description: "O depoimento foi salvo com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchTestimonials();
      toast({
        title: "Depoimento removido!",
        description: "O depoimento foi excluído com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const bioLinkUrl = formData.business_name ? `/bio/${formData.business_name}` : '';
  const fullBioLinkUrl = formData.business_name ? `${window.location.origin}/bio/${formData.business_name}` : '';

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Editor do BioLink</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Personalize sua página pública de agendamentos</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {bioLinkUrl ? (
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href={bioLinkUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </a>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
          )}
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar e Criar Link'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Profile Information */}
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            Informações do Perfil
          </h2>
          
          <div className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : profile?.avatar_url} />
                <AvatarFallback>
                  {formData.business_name ? formData.business_name[0] : formData.first_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-accent">
                    <Upload className="w-4 h-4" />
                    Foto de Perfil
                  </div>
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <Label htmlFor="banner" className="text-sm font-medium">Banner</Label>
              <div className="mt-2">
                {(bannerFile || profile?.banner_url) && (
                  <div className="mb-3">
                    <img
                      src={bannerFile ? URL.createObjectURL(bannerFile) : profile?.banner_url}
                      alt="Banner"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <Label htmlFor="banner" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-accent">
                    <ImageIcon className="w-4 h-4" />
                    {(bannerFile || profile?.banner_url) ? 'Alterar Banner' : 'Adicionar Banner'}
                  </div>
                </Label>
                <Input
                  id="banner"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first_name">Nome</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="business_name">Nome do Negócio</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                placeholder="nome-do-seu-negocio"
              />
              {formData.business_name && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  Seu link: /bio/{formData.business_name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Excelência em atendimento. Agende seu horário e tenha a melhor experiência conosco."
                rows={3}
              />
            </div>
          </div>
        </GlassCard>

        {/* BioLink Configuration */}
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Configurações do BioLink
          </h2>
          
          <div className="space-y-6">
            {/* Links Sociais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Links Sociais</h3>
              
              <div>
                <Label htmlFor="whatsapp_link">Link do WhatsApp</Label>
                <Input
                  id="whatsapp_link"
                  value={formData.whatsapp_link}
                  onChange={(e) => setFormData({...formData, whatsapp_link: e.target.value})}
                  placeholder="https://wa.me/5511999999999"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Deixe vazio para usar automaticamente o telefone do perfil
                </p>
              </div>

              <div>
                <Label htmlFor="instagram_link">Link do Instagram</Label>
                <Input
                  id="instagram_link"
                  value={formData.instagram_link}
                  onChange={(e) => setFormData({...formData, instagram_link: e.target.value})}
                  placeholder="https://instagram.com/seunegocio"
                />
              </div>

              <div>
                <Label htmlFor="website_link">Link do Website</Label>
                <Input
                  id="website_link"
                  value={formData.website_link}
                  onChange={(e) => setFormData({...formData, website_link: e.target.value})}
                  placeholder="https://seusite.com"
                />
              </div>
            </div>

            {/* Cores e Temas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cores e Tema</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="use_gradient_background">Tipo de Fundo</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="use_gradient_background"
                      checked={formData.use_gradient_background}
                      onChange={(e) => setFormData({...formData, use_gradient_background: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm">Usar gradiente</span>
                  </div>
                </div>
              </div>

              {formData.use_gradient_background ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="background_gradient_start">Cor Inicial do Gradiente</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id="background_gradient_start"
                        type="color"
                        value={formData.background_gradient_start}
                        onChange={(e) => setFormData({...formData, background_gradient_start: e.target.value})}
                        className="w-16 h-10 p-1 border rounded cursor-pointer"
                      />
                      <Input
                        value={formData.background_gradient_start}
                        onChange={(e) => setFormData({...formData, background_gradient_start: e.target.value})}
                        placeholder="#16213e"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="background_gradient_end">Cor Final do Gradiente</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id="background_gradient_end"
                        type="color"
                        value={formData.background_gradient_end}
                        onChange={(e) => setFormData({...formData, background_gradient_end: e.target.value})}
                        className="w-16 h-10 p-1 border rounded cursor-pointer"
                      />
                      <Input
                        value={formData.background_gradient_end}
                        onChange={(e) => setFormData({...formData, background_gradient_end: e.target.value})}
                        placeholder="#0f172a"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="background_color">Cor de Fundo</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="background_color"
                      type="color"
                      value={formData.background_color}
                      onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                      className="w-16 h-10 p-1 border rounded cursor-pointer"
                    />
                    <Input
                      value={formData.background_color}
                      onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                      placeholder="#1a1a2e"
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="text_primary_color">Cor do Texto Principal</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="text_primary_color"
                      type="color"
                      value={formData.text_primary_color}
                      onChange={(e) => setFormData({...formData, text_primary_color: e.target.value})}
                      className="w-16 h-10 p-1 border rounded cursor-pointer"
                    />
                    <Input
                      value={formData.text_primary_color}
                      onChange={(e) => setFormData({...formData, text_primary_color: e.target.value})}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="text_secondary_color">Cor do Texto Secundário</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="text_secondary_color"
                      type="color"
                      value={formData.text_secondary_color.replace('rgba(255,255,255,0.8)', '#cccccc')}
                      onChange={(e) => setFormData({...formData, text_secondary_color: e.target.value})}
                      className="w-16 h-10 p-1 border rounded cursor-pointer"
                    />
                    <Input
                      value={formData.text_secondary_color}
                      onChange={(e) => setFormData({...formData, text_secondary_color: e.target.value})}
                      placeholder="rgba(255,255,255,0.8)"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_background_color">Cor dos Botões</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="button_background_color"
                      type="color"
                      value={formData.button_background_color}
                      onChange={(e) => setFormData({...formData, button_background_color: e.target.value})}
                      className="w-16 h-10 p-1 border rounded cursor-pointer"
                    />
                    <Input
                      value={formData.button_background_color}
                      onChange={(e) => setFormData({...formData, button_background_color: e.target.value})}
                      placeholder="#10b981"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="button_text_color">Cor do Texto dos Botões</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="button_text_color"
                      type="color"
                      value={formData.button_text_color}
                      onChange={(e) => setFormData({...formData, button_text_color: e.target.value})}
                      className="w-16 h-10 p-1 border rounded cursor-pointer"
                    />
                    <Input
                      value={formData.button_text_color}
                      onChange={(e) => setFormData({...formData, button_text_color: e.target.value})}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="card_background_color">Cor de Fundo dos Cards</Label>
                  <Input
                    id="card_background_color"
                    value={formData.card_background_color}
                    onChange={(e) => setFormData({...formData, card_background_color: e.target.value})}
                    placeholder="rgba(255,255,255,0.1)"
                  />
                </div>
                <div>
                  <Label htmlFor="card_border_color">Cor da Borda dos Cards</Label>
                  <Input
                    id="card_border_color"
                    value={formData.card_border_color}
                    onChange={(e) => setFormData({...formData, card_border_color: e.target.value})}
                    placeholder="rgba(255,255,255,0.2)"
                  />
                </div>
              </div>
            </div>

            {/* Tipografia e Estilo */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tipografia e Estilo</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="font_family">Fonte</Label>
                  <select
                    id="font_family"
                    value={formData.font_family}
                    onChange={(e) => setFormData({...formData, font_family: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-background"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Nunito">Nunito</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="font_size">Tamanho da Fonte</Label>
                  <select
                    id="font_size"
                    value={formData.font_size}
                    onChange={(e) => setFormData({...formData, font_size: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-background"
                  >
                    <option value="small">Pequeno</option>
                    <option value="medium">Médio</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="border_radius">Arredondamento</Label>
                  <select
                    id="border_radius"
                    value={formData.border_radius}
                    onChange={(e) => setFormData({...formData, border_radius: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-background"
                  >
                    <option value="none">Nenhum</option>
                    <option value="small">Pequeno</option>
                    <option value="medium">Médio</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="shadow_intensity">Intensidade da Sombra</Label>
                  <select
                    id="shadow_intensity"
                    value={formData.shadow_intensity}
                    onChange={(e) => setFormData({...formData, shadow_intensity: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-background"
                  >
                    <option value="none">Nenhuma</option>
                    <option value="light">Leve</option>
                    <option value="medium">Média</option>
                    <option value="strong">Forte</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Business Hours */}
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            Horários de Funcionamento
          </h2>
          
          <div className="space-y-3">
            {dayNames.map((dayName, index) => {
              const dayHour = businessHours.find(h => h.day_of_week === index);
              
              return (
                <Card key={index} className="p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium min-w-[80px] text-sm sm:text-base">{dayName}</span>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={dayHour?.is_working || false}
                          onChange={(e) => updateBusinessHours(index, 'is_working', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Aberto</span>
                      </label>
                    </div>
                    
                    {dayHour?.is_working && (
                      <div className="flex items-center gap-2 text-sm">
                        <Input
                          type="time"
                          value={dayHour.start_time || '09:00'}
                          onChange={(e) => updateBusinessHours(index, 'start_time', e.target.value)}
                          className="w-20 sm:w-24"
                        />
                        <span>às</span>
                        <Input
                          type="time"
                          value={dayHour.end_time || '18:00'}
                          onChange={(e) => updateBusinessHours(index, 'end_time', e.target.value)}
                          className="w-20 sm:w-24"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Link Generator */}
      {formData.business_name && (
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Link do Cliente
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Link público para clientes</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={fullBioLinkUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(fullBioLinkUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => shareLink(fullBioLinkUrl)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Compartilhe este link com seus clientes para eles agendarem
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => copyToClipboard(fullBioLinkUrl)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => shareLink(fullBioLinkUrl)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <Label className="text-sm font-medium">QR Code</Label>
              <div className="mt-2 flex justify-center">
                <img
                  src={generateQRCode(fullBioLinkUrl)}
                  alt="QR Code do BioLink"
                  className="w-32 h-32 border rounded-lg"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Clientes podem escanear para acessar diretamente
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Links Salvos */}
      <GlassCard className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
          <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
          Links Salvos
        </h2>
        {bioLinks.length > 0 ? (
          <div className="space-y-3">
            {bioLinks.map((bioLink) => (
              <div key={bioLink.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base">{bioLink.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">/bio/{bioLink.slug}</p>
                  <p className="text-xs text-muted-foreground">
                    Criado em: {new Date(bioLink.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyBioLinkUrl(bioLink.slug)}
                    className="h-8 px-3 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar Link
                  </Button>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`bio-link-${bioLink.id}`} className="text-sm">
                      {bioLink.is_active ? 'Ativo' : 'Inativo'}
                    </Label>
                    <Switch
                      id={`bio-link-${bioLink.id}`}
                      checked={bioLink.is_active}
                      onCheckedChange={(checked) => toggleBioLink(bioLink.id, checked)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteBioLink(bioLink.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Link2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum link salvo ainda</p>
            <p className="text-sm text-muted-foreground">
              Preencha as informações e salve para criar seu primeiro bio link
            </p>
          </div>
        )}
      </GlassCard>

      {/* Testimonials Management */}
      <GlassCard className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          Depoimentos (Fotos)
        </h2>
        
        <div className="space-y-6">
          {/* Add New Testimonial */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Adicionar Novo Depoimento</h3>
            
            <div>
              <Label htmlFor="testimonial-image">Imagem do Depoimento</Label>
              <div className="mt-2">
                {testimonialFile && (
                  <div className="mb-3">
                    <img
                      src={URL.createObjectURL(testimonialFile)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <Label htmlFor="testimonial-image" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-accent">
                    <Upload className="w-4 h-4" />
                    {testimonialFile ? 'Alterar Imagem' : 'Selecionar Imagem'}
                  </div>
                </Label>
                <Input
                  id="testimonial-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setTestimonialFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="client-name">Nome do Cliente (opcional)</Label>
              <Input
                id="client-name"
                value={newTestimonial.client_name}
                onChange={(e) => setNewTestimonial({...newTestimonial, client_name: e.target.value})}
                placeholder="João Silva"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={newTestimonial.description}
                onChange={(e) => setNewTestimonial({...newTestimonial, description: e.target.value})}
                placeholder="Excelente atendimento, super recomendo!"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="rating">Avaliação</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newTestimonial.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={addTestimonial} 
              disabled={loading || !testimonialFile}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Depoimento
            </Button>
          </div>

          {/* Existing Testimonials */}
          {testimonials.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Depoimentos Existentes ({testimonials.length}/10)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="relative group">
                    <img
                      src={testimonial.image_url}
                      alt={`Depoimento de ${testimonial.client_name || 'cliente'}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteTestimonial(testimonial.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {testimonial.client_name && (
                      <p className="text-sm mt-1 text-center font-medium">{testimonial.client_name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Preview */}
      {bioLinkUrl && (
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Preview do BioLink</h2>
          <div className="bg-gradient-hero rounded-lg p-4">
            <div className="max-w-md mx-auto">
              {/* Banner */}
              {(bannerFile || profile?.banner_url) && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={bannerFile ? URL.createObjectURL(bannerFile) : profile?.banner_url}
                    alt="Banner"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
              
              {/* Profile */}
              <div className="text-center mb-4">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : profile?.avatar_url} />
                  <AvatarFallback>
                    {formData.business_name ? formData.business_name[0] : formData.first_name[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-bold text-white">
                  {formData.business_name || `${formData.first_name} ${formData.last_name}`}
                </h3>
                <Badge variant="secondary" className="mt-2">
                  {bioLinkUrl}
                </Badge>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};