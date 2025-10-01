import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Phone, Mail, Star, MessageCircle, Instagram, Globe, QrCode, Moon, Sun } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking/booking-form';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';

interface BusinessProfile {
  user_id: string;
  business_name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  avatar_url: string;
  banner_url?: string;
  timezone: string;
  whatsapp_link?: string;
  instagram_link?: string;
  website_link?: string;
  font_color?: string;
  description?: string;
  background_color?: string;
  background_gradient_start?: string;
  background_gradient_end?: string;
  card_background_color?: string;
  card_border_color?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  text_primary_color?: string;
  text_secondary_color?: string;
  button_background_color?: string;
  button_text_color?: string;
  section_header_color?: string;
  font_family?: string;
  font_size?: string;
  border_radius?: string;
  shadow_intensity?: string;
  use_gradient_background?: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  color: string;
}

interface BusinessHours {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working: boolean;
}

const BioLink = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showHours, setShowHours] = useState(false);

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    if (username) {
      fetchBusinessData();
    }
  }, [username]);

  const fetchBusinessData = async () => {
    try {
      // Fetch bio_link by slug
      const { data: bioLinkData, error: bioLinkError } = await supabase
        .from('bio_links')
        .select('*')
        .eq('slug', username)
        .eq('is_active', true)
        .maybeSingle();

      if (bioLinkError || !bioLinkData) {
        console.error('Bio link not found:', bioLinkError);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Use bio_link data as profile
      setProfile({
        user_id: bioLinkData.user_id,
        business_name: bioLinkData.business_name,
        avatar_url: bioLinkData.avatar_url,
        banner_url: bioLinkData.banner_url,
        description: bioLinkData.description,
        whatsapp_link: bioLinkData.whatsapp_link,
        instagram_link: bioLinkData.instagram_link,
        website_link: bioLinkData.website_link,
        font_color: bioLinkData.font_color,
        background_color: bioLinkData.background_color,
        background_gradient_start: bioLinkData.background_gradient_start,
        background_gradient_end: bioLinkData.background_gradient_end,
        card_background_color: bioLinkData.card_background_color,
        card_border_color: bioLinkData.card_border_color,
        primary_color: bioLinkData.primary_color,
        secondary_color: bioLinkData.secondary_color,
        accent_color: bioLinkData.accent_color,
        text_primary_color: bioLinkData.text_primary_color,
        text_secondary_color: bioLinkData.text_secondary_color,
        button_background_color: bioLinkData.button_background_color,
        button_text_color: bioLinkData.button_text_color,
        section_header_color: bioLinkData.section_header_color,
        font_family: bioLinkData.font_family,
        font_size: bioLinkData.font_size,
        border_radius: bioLinkData.border_radius,
        shadow_intensity: bioLinkData.shadow_intensity,
        use_gradient_background: bioLinkData.use_gradient_background,
        timezone: 'America/Sao_Paulo'
      } as BusinessProfile);

      // Fetch services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', bioLinkData.user_id)
        .eq('is_active', true);

      if (servicesData) setServices(servicesData);

      // Fetch business hours
      const { data: hoursData } = await supabase
        .from('business_hours')
        .select('*')
        .eq('user_id', bioLinkData.user_id)
        .order('day_of_week');

      if (hoursData) setBusinessHours(hoursData);

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', bioLinkData.user_id)
        .eq('is_active', true)
        .order('display_order');

      if (testimonialsData) setTestimonials(testimonialsData);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Negócio não encontrado</h1>
          <p className="text-white/80">O link que você acessou não foi encontrado.</p>
        </GlassCard>
      </div>
    );
  }

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const getWhatsAppLink = () => {
    // Use custom WhatsApp link if provided, otherwise use phone from profile
    if (profile?.whatsapp_link) return profile.whatsapp_link;
    if (!profile?.phone) return '#';
    const cleanPhone = profile.phone.replace(/\D/g, '');
    return `https://wa.me/55${cleanPhone}?text=Olá! Gostaria de agendar um horário.`;
  };

  const getBorderRadiusClass = () => {
    switch (profile?.border_radius) {
      case 'none': return 'rounded-none';
      case 'small': return 'rounded-lg';
      case 'large': return 'rounded-3xl';
      default: return 'rounded-2xl';
    }
  };

  const getShadowClass = () => {
    switch (profile?.shadow_intensity) {
      case 'none': return '';
      case 'light': return 'shadow-sm';
      case 'strong': return 'shadow-2xl';
      default: return 'shadow-lg';
    }
  };

  const getFontSizeClass = () => {
    switch (profile?.font_size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const backgroundStyle = profile?.use_gradient_background 
    ? {
        background: `linear-gradient(135deg, ${profile.background_gradient_start || '#16213e'}, ${profile.background_gradient_end || '#0f172a'})`
      }
    : {
        backgroundColor: profile?.background_color || '#1a1a2e'
      };

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-slate-900' : ''}`} 
      style={{
        ...(!darkMode ? backgroundStyle : {}),
        color: profile?.text_primary_color || '#ffffff',
        fontFamily: profile?.font_family || 'Inter'
      }}
    >
      {/* Banner Section */}
      {profile?.banner_url && (
        <div className="w-full h-48 relative overflow-hidden">
          <img
            src={profile.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="glass hover:bg-white/20 border border-white/20"
          style={{ color: profile?.text_primary_color || '#ffffff' }}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      <div className={`container mx-auto px-4 py-8 max-w-md ${getFontSizeClass()} relative z-10`}>
        {/* Profile Section */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="relative mb-6">
            <Avatar className="w-28 h-28 mx-auto border-4 border-white/30 shadow-2xl">
              <AvatarImage src={profile.avatar_url} className="object-cover" />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {profile.business_name ? profile.business_name[0] : (profile.first_name?.[0] || 'U')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Business Name */}
          <h1 className="text-3xl font-bold mb-4 leading-tight" style={{ color: profile?.section_header_color || profile?.text_primary_color || '#ffffff' }}>
            {profile.business_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Profissional'}
          </h1>

          {/* Stars Rating */}
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          {/* Description */}
          <p className="text-lg mb-6 leading-relaxed max-w-xs mx-auto" style={{ color: profile?.text_secondary_color || 'rgba(255,255,255,0.8)' }}>
            {profile.description || 'Excelência em atendimento. Agende seu horário e tenha a melhor experiência conosco.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          {/* WhatsApp Button */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button 
              className={`w-full text-lg py-6 ${getBorderRadiusClass()} ${getShadowClass()} hover:shadow-xl transition-all duration-300 hover:scale-105`}
              style={{
                backgroundColor: profile?.button_background_color || '#10b981',
                color: profile?.button_text_color || '#ffffff'
              }}
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Agendar pelo WhatsApp
            </Button>
          </a>

          {/* View Hours Button */}
          <Button
            onClick={() => setShowHours(!showHours)}
            variant="outline"
            className={`w-full text-lg py-6 ${getBorderRadiusClass()} hover:bg-white/20 transition-all duration-300`}
            style={{
              backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)',
              borderColor: profile?.card_border_color || 'rgba(255,255,255,0.2)',
              color: profile?.text_primary_color || '#ffffff'
            }}
          >
            <Clock className="w-6 h-6 mr-3" />
            Ver horários disponíveis
          </Button>

          {/* Custom Links */}
          <div className="grid grid-cols-2 gap-4">
            {profile.instagram_link && (
              <a href={profile.instagram_link} target="_blank" rel="noopener noreferrer" className="block">
                <Button
                  variant="outline"
                  className={`w-full py-4 ${getBorderRadiusClass()} hover:bg-white/20 transition-all duration-300`}
                  style={{
                    backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)',
                    borderColor: profile?.card_border_color || 'rgba(255,255,255,0.2)',
                    color: profile?.text_primary_color || '#ffffff'
                  }}
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  Instagram
                </Button>
              </a>
            )}
            {profile.website_link ? (
              <a href={profile.website_link} target="_blank" rel="noopener noreferrer" className="block">
                <Button
                  variant="outline"
                  className={`w-full py-4 ${getBorderRadiusClass()} hover:bg-white/20 transition-all duration-300`}
                  style={{
                    backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)',
                    borderColor: profile?.card_border_color || 'rgba(255,255,255,0.2)',
                    color: profile?.text_primary_color || '#ffffff'
                  }}
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Site
                </Button>
              </a>
            ) : (
              <Button
                variant="outline"
                className={`w-full py-4 ${getBorderRadiusClass()} transition-all duration-300 opacity-50 cursor-not-allowed`}
                style={{
                  backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)',
                  borderColor: profile?.card_border_color || 'rgba(255,255,255,0.2)',
                  color: profile?.text_primary_color || '#ffffff'
                }}
                disabled
              >
                <Globe className="w-5 h-5 mr-2" />
                Site
              </Button>
            )}
          </div>
        </div>

        {/* Hours Section */}
        {showHours && (
          <div 
            className={`p-6 mb-8 animate-fade-in ${getBorderRadiusClass()} ${getShadowClass()}`}
            style={{
              backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)',
              borderColor: profile?.card_border_color || 'rgba(255,255,255,0.2)',
              border: '1px solid'
            }}
          >
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: profile?.section_header_color || profile?.text_primary_color || '#ffffff' }}>
              Horários de Funcionamento
            </h3>
            <div className="space-y-3">
              {businessHours.map((hour) => (
                <div 
                  key={hour.day_of_week} 
                  className={`flex justify-between items-center p-3 ${getBorderRadiusClass()}`}
                  style={{
                    backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)',
                    borderColor: profile?.card_border_color || 'rgba(255,255,255,0.2)',
                    border: '1px solid'
                  }}
                >
                  <span className="font-medium" style={{ color: profile?.text_primary_color || '#ffffff' }}>
                    {dayNames[hour.day_of_week]}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${hour.is_working ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className={`font-medium ${hour.is_working ? "text-green-300" : "text-red-300"}`}>
                      {hour.is_working ? `${hour.start_time} - ${hour.end_time}` : 'Fechado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div 
            className={`p-6 mb-8 ${getBorderRadiusClass()} ${getShadowClass()}`}
            style={{
              backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)',
              borderColor: profile?.card_border_color || 'rgba(255,255,255,0.2)',
              border: '1px solid'
            }}
          >
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        )}

        {/* Services Cards */}
        {services.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold text-center mb-4" style={{ color: profile?.section_header_color || profile?.text_primary_color || '#ffffff' }}>
              Nossos Serviços
            </h3>
            {services.map((service) => (
              <div 
                key={service.id} 
                className={`p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer ${getBorderRadiusClass()} ${getShadowClass()}`}
                style={{
                  backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)',
                  borderColor: profile?.card_border_color || 'rgba(255,255,255,0.2)',
                  border: '1px solid'
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-lg" style={{ color: profile?.text_primary_color || '#ffffff' }}>
                    {service.name}
                  </h4>
                  <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                    R$ {service.price}
                  </Badge>
                </div>
                {service.description && (
                  <p className="text-sm mb-3" style={{ color: profile?.text_secondary_color || 'rgba(255,255,255,0.8)' }}>
                    {service.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1" style={{ color: profile?.text_secondary_color || 'rgba(255,255,255,0.7)' }}>
                    <Clock className="w-4 h-4" />
                    {service.duration} min
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => setSelectedService(service)}
                        className={`hover:scale-105 transition-transform duration-200 ${getBorderRadiusClass()}`}
                        style={{
                          backgroundColor: profile?.button_background_color || '#10b981',
                          color: profile?.button_text_color || '#ffffff'
                        }}
                      >
                        Agendar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="mx-4 max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)' }}>
                      <DialogHeader>
                        <DialogTitle style={{ color: profile?.text_primary_color || '#ffffff' }}>Agendar {service.name}</DialogTitle>
                      </DialogHeader>
                      <BookingForm service={service} businessProfile={profile} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QR Code Section */}
        <div 
          className={`p-6 text-center mb-8 ${getBorderRadiusClass()} ${getShadowClass()}`}
          style={{
            backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)',
            borderColor: profile?.card_border_color || 'rgba(255,255,255,0.2)',
            border: '1px solid'
          }}
        >
          <QrCode className="w-12 h-12 mx-auto mb-3" style={{ color: profile?.text_secondary_color || 'rgba(255,255,255,0.8)' }} />
          <p className="text-sm" style={{ color: profile?.text_secondary_color || 'rgba(255,255,255,0.8)' }}>
            Compartilhe este link com seus amigos
          </p>
          <Button
            variant="outline"
            size="sm"
            className={`mt-3 hover:bg-white/20 ${getBorderRadiusClass()}`}
            style={{
              backgroundColor: profile?.card_background_color || 'rgba(255,255,255,0.1)',
              borderColor: profile?.card_border_color || 'rgba(255,255,255,0.2)',
              color: profile?.text_primary_color || '#ffffff'
            }}
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            Copiar Link
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm" style={{ color: profile?.text_secondary_color || 'rgba(255,255,255,0.6)' }}>
          <p>Powered by <span className="font-semibold" style={{ color: profile?.accent_color || '#8b5cf6' }}>GoAgendas</span></p>
        </div>
      </div>
    </div>
  );
};

export default BioLink;
