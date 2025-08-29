import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Phone, Mail, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking/booking-form';

interface BusinessProfile {
  user_id: string;
  business_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  avatar_url: string;
  banner_url?: string;
  timezone: string;
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
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    if (username) {
      fetchBusinessData();
    }
  }, [username]);

  const fetchBusinessData = async () => {
    try {
      // Fetch business profile by business_name (using as username)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('business_name', username)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error('Profile not found:', profileError);
        return;
      }

      setProfile(profileData);

      // Fetch services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', profileData.user_id)
        .eq('is_active', true);

      if (servicesData) setServices(servicesData);

      // Fetch business hours
      const { data: hoursData } = await supabase
        .from('business_hours')
        .select('*')
        .eq('user_id', profileData.user_id)
        .order('day_of_week');

      if (hoursData) setBusinessHours(hoursData);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <GlassCard className="p-6 sm:p-8 text-center max-w-sm mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">Negócio não encontrado</h1>
          <p className="text-sm sm:text-base text-white/80">O link que você acessou não foi encontrado.</p>
        </GlassCard>
      </div>
    );
  }

  const workingHours = businessHours.filter(h => h.is_working);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-sm sm:max-w-md">
        {/* Banner */}
        {profile.banner_url && (
          <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl overflow-hidden">
            <img
              src={profile.banner_url}
              alt="Banner"
              className="w-full h-28 xs:h-32 sm:h-48 object-cover"
            />
          </div>
        )}
        
        {/* Business Header */}
        <GlassCard className="p-4 sm:p-6 text-center mb-4 sm:mb-6">
          <Avatar className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 mx-auto mb-4 border-2 border-white/20">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-xl xs:text-2xl sm:text-3xl font-bold bg-gradient-to-br from-primary to-primary/60">
              {profile.business_name ? profile.business_name[0] : profile.first_name[0]}
            </AvatarFallback>
          </Avatar>
          
          {/* Business Name */}
          <div className="mb-4">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              {profile.business_name || `${profile.first_name} ${profile.last_name}`}
            </h1>
            {profile.business_name && (
              <p className="text-white/70 text-sm xs:text-base">
                {profile.first_name} {profile.last_name}
              </p>
            )}
          </div>
          
          {/* 5 Stars */}
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-2 text-white/90 text-sm xs:text-base font-medium">
            <span>★ 5.0 • Avaliação perfeita</span>
          </div>
        </GlassCard>

        {/* Contact Info */}
        <GlassCard className="p-3 sm:p-4 mb-4 sm:mb-6">
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Contato</h2>
          <div className="space-y-2">
            {profile.phone && (
              <div className="flex items-center gap-2 sm:gap-3 text-white/90 text-xs xs:text-sm sm:text-base">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-all">{profile.phone}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-2 sm:gap-3 text-white/90 text-xs xs:text-sm sm:text-base">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-all text-xs xs:text-sm">{profile.email}</span>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Business Hours */}
        <GlassCard className="p-4 sm:p-5 mb-4 sm:mb-6">
          <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-primary" />
            Horários de Funcionamento
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {businessHours.map((hour) => (
              <div key={hour.day_of_week} className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white font-medium text-sm xs:text-base">
                  {dayNames[hour.day_of_week]}
                </span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${hour.is_working ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className={`text-sm xs:text-base font-medium ${hour.is_working ? "text-green-400" : "text-red-400"}`}>
                    {hour.is_working ? `${hour.start_time} - ${hour.end_time}` : 'Fechado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Services */}
        <GlassCard className="p-3 sm:p-4 mb-4 sm:mb-6">
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Serviços</h2>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="border border-white/20 rounded-lg p-3">
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium text-white text-xs xs:text-sm sm:text-base flex-1 min-w-0">
                      {service.name}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      style={{ backgroundColor: service.color + '20', color: service.color }} 
                      className="text-xs flex-shrink-0"
                    >
                      R$ {service.price}
                    </Badge>
                  </div>
                </div>
                {service.description && (
                  <p className="text-white/80 text-xs sm:text-sm mb-2 leading-relaxed">{service.description}</p>
                )}
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
                  <span className="text-white/70 text-xs sm:text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.duration} min
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="neon"
                        size="sm"
                        className="w-full xs:w-auto text-xs sm:text-sm px-3 sm:px-4 py-2"
                        onClick={() => setSelectedService(service)}
                      >
                        Agendar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-neon mx-3 sm:mx-4 max-w-[calc(100vw-1.5rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white text-sm sm:text-base">Agendar {service.name}</DialogTitle>
                      </DialogHeader>
                      <BookingForm service={service} businessProfile={profile} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center text-white/60 text-xs sm:text-sm pb-4">
          Powered by GoAgendas
        </div>
      </div>
    </div>
  );
};

export default BioLink;
