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
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Negócio não encontrado</h1>
          <p className="text-white/80">O link que você acessou não foi encontrado.</p>
        </GlassCard>
      </div>
    );
  }

  const workingHours = businessHours.filter(h => h.is_working);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-md">
        {/* Banner */}
        {profile.banner_url && (
          <div className="mb-4 sm:mb-6 rounded-xl overflow-hidden">
            <img
              src={profile.banner_url}
              alt="Banner"
              className="w-full h-32 sm:h-48 object-cover"
            />
          </div>
        )}
        
        {/* Business Header */}
        <GlassCard className="p-4 sm:p-6 text-center mb-4 sm:mb-6">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-xl sm:text-2xl">
              {profile.business_name ? profile.business_name[0] : profile.first_name[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
            {profile.business_name || `${profile.first_name} ${profile.last_name}`}
          </h1>
          
          {/* 5 Stars */}
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm sm:text-base">
            <span>5.0 • Avaliação perfeita</span>
          </div>
        </GlassCard>

        {/* Contact Info */}
        <GlassCard className="p-4 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3">Contato</h2>
          <div className="space-y-2">
            {profile.phone && (
              <div className="flex items-center gap-3 text-white/90 text-sm sm:text-base">
                <Phone className="w-4 h-4" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-3 text-white/90 text-sm sm:text-base">
                <Mail className="w-4 h-4" />
                <span className="break-all">{profile.email}</span>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Business Hours */}
        <GlassCard className="p-4 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            Horários de Funcionamento
          </h2>
          <div className="space-y-2">
            {businessHours.map((hour) => (
              <div key={hour.day_of_week} className="flex justify-between text-sm">
                <span className="text-white/90">{dayNames[hour.day_of_week]}</span>
                <span className={hour.is_working ? "text-green-400" : "text-red-400"}>
                  {hour.is_working ? `${hour.start_time} - ${hour.end_time}` : 'Fechado'}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Services */}
        <GlassCard className="p-4 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3">Serviços</h2>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="border border-white/20 rounded-lg p-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                  <h3 className="font-medium text-white text-sm sm:text-base">{service.name}</h3>
                  <Badge variant="secondary" style={{ backgroundColor: service.color + '20', color: service.color }} className="self-start">
                    R$ {service.price}
                  </Badge>
                </div>
                {service.description && (
                  <p className="text-white/80 text-xs sm:text-sm mb-2">{service.description}</p>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-white/70 text-xs sm:text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.duration} min
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="neon"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => setSelectedService(service)}
                      >
                        Agendar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-neon mx-4 max-w-[calc(100vw-2rem)] sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-white">Agendar {service.name}</DialogTitle>
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
        <div className="text-center text-white/60 text-sm">
          Powered by GoAgendas
        </div>
      </div>
    </div>
  );
};

export default BioLink;