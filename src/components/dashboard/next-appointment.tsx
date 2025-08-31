import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, User, MapPin, Phone, Calendar as CalendarIcon, CheckCircle, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';

interface NextAppointment {
  id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  services: {
    name: string;
    price: number;
    duration: number;
  };
}

export function NextAppointment() {
  const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchNextAppointment = async () => {
      try {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().slice(0, 8);

        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            client_name,
            client_phone,
            appointment_date,
            start_time,
            end_time,
            status,
            services (
              name,
              price,
              duration
            )
          `)
          .eq('user_id', user.id)
          .in('status', ['scheduled', 'confirmed'])
          .or(`appointment_date.gt.${today},and(appointment_date.eq.${today},start_time.gt.${currentTime})`)
          .order('appointment_date')
          .order('start_time')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setNextAppointment(data || null);
      } catch (error) {
        console.error('Error fetching next appointment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextAppointment();
  }, [user]);

  if (loading) {
    return (
      <GlassCard variant="premium">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="loading-skeleton w-5 h-5 rounded"></div>
            <div className="loading-skeleton h-5 w-32 rounded"></div>
          </div>
          <div className="loading-skeleton h-20 rounded-xl"></div>
        </div>
      </GlassCard>
    );
  }

  if (!nextAppointment) {
    return (
      <GlassCard variant="premium" className="group">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-headline font-semibold">Próximo Agendamento</h3>
          </div>
          
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <CalendarIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-body font-medium">Agenda livre</p>
              <p className="text-caption">
                Que tal aproveitar para organizar sua agenda?
              </p>
            </div>
            <Button variant="minimal" size="sm" asChild>
              <a href="/calendar">
                <CalendarIcon className="w-4 h-4" />
                Ver Agenda
              </a>
            </Button>
          </div>
        </div>
      </GlassCard>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  const isToday = (date: string) => {
    return date === new Date().toISOString().split('T')[0];
  };

  const getTimeUntil = () => {
    const appointmentDateTime = new Date(`${nextAppointment.appointment_date}T${nextAppointment.start_time}`);
    const now = new Date();
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `em ${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `em ${diffMinutes}m`;
    } else {
      return 'agora';
    }
  };

  return (
    <GlassCard variant="premium" hover className="group">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-headline font-semibold">Próximo Agendamento</h3>
          </div>
          <Badge 
            variant={isToday(nextAppointment.appointment_date) ? "default" : "secondary"}
            className="status-badge"
          >
            {isToday(nextAppointment.appointment_date) ? 'Hoje' : formatDate(nextAppointment.appointment_date)}
          </Badge>
        </div>

        {/* Client Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-border group-hover:border-primary/30 transition-colors duration-300">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-lg">
              {getInitials(nextAppointment.client_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-lg truncate">
                {nextAppointment.client_name}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-caption">
              <Phone className="w-3 h-3 text-muted-foreground" />
              <span>{nextAppointment.client_phone}</span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="premium-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-body">{nextAppointment.services.name}</span>
            <span className="metric-display text-lg text-primary">
              R$ {nextAppointment.services.price.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-caption">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span>
                {formatTime(nextAppointment.start_time)} - {formatTime(nextAppointment.end_time)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span>{nextAppointment.services.duration}min</span>
            </div>
          </div>

          {/* Time until appointment */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">
              {getTimeUntil()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button size="sm" className="flex-1 group/btn">
            <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
            Confirmar
          </Button>
          <Button size="sm" variant="outline" className="flex-1 group/btn">
            <RotateCcw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-300" />
            Reagendar
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}