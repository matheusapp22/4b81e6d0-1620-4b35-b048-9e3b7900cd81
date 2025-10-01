import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, User, MapPin, Phone, Calendar as CalendarIcon, CheckCircle, RotateCcw, Activity, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="loading-skeleton w-6 h-6 rounded-xl"></div>
            <div className="loading-skeleton h-6 w-48 rounded"></div>
          </div>
          <div className="loading-skeleton h-32 rounded-2xl"></div>
        </div>
      </GlassCard>
    );
  }

  if (!nextAppointment) {
    return (
      <GlassCard variant="premium" className="group">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-400">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-title font-bold">Próximo Agendamento</h3>
          </div>
          
          <div className="text-center py-12 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500">
                <CalendarIcon className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center animate-bounce-subtle">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-body font-bold">Agenda livre!</h4>
              <p className="text-caption max-w-xs mx-auto leading-relaxed">
                Momento perfeito para organizar sua agenda ou revisar seus clientes.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button variant="futuristic" size="default" asChild className="w-full">
                <a href="/appointments">
                  <CalendarIcon className="w-4 h-4" />
                  Novo Agendamento
                </a>
              </Button>
              <Button variant="elegant" size="default" asChild className="w-full">
                <a href="/calendar">
                  <Activity className="w-4 h-4" />
                  Ver Agenda Completa
                </a>
              </Button>
            </div>
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

  const handleConfirm = async () => {
    if (!nextAppointment || updating) return;

    try {
      setUpdating(true);
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', nextAppointment.id);

      if (error) throw error;

      toast({
        title: "Agendamento confirmado!",
        description: "O cliente será notificado da confirmação.",
      });

      // Refresh the appointment
      setNextAppointment({ ...nextAppointment, status: 'confirmed' });
    } catch (error: any) {
      toast({
        title: "Erro ao confirmar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleReschedule = () => {
    if (!nextAppointment) return;
    navigate(`/appointments?appointmentId=${nextAppointment.id}`);
  };

  return (
    <GlassCard variant="premium" hover className="group">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-400 shadow-card">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-title font-bold">Próximo Agendamento</h3>
          </div>
          <Badge 
            className={`status-indicator ${isToday(nextAppointment.appointment_date) ? 'info' : 'success'} px-4 py-2`}
          >
            <CalendarIcon className="w-3 h-3" />
            {isToday(nextAppointment.appointment_date) ? 'Hoje' : formatDate(nextAppointment.appointment_date)}
          </Badge>
        </div>

        {/* Client Profile */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-16 w-16 border-3 border-border group-hover:border-primary/30 transition-all duration-400 shadow-card">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-xl">
                {getInitials(nextAppointment.client_name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background animate-pulse"></div>
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-bold text-body truncate">
                {nextAppointment.client_name}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-caption">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{nextAppointment.client_phone}</span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="premium-card p-6 space-y-4 bg-gradient-tech">
          <div className="flex items-center justify-between">
            <span className="font-bold text-body">{nextAppointment.services.name}</span>
            <span className="metric-display text-xl text-primary font-bold">
              R$ {nextAppointment.services.price.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center gap-8 text-caption">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {formatTime(nextAppointment.start_time)} - {formatTime(nextAppointment.end_time)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{nextAppointment.services.duration}min</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3 pt-4 border-t border-border/50">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-bold text-primary">
              Começa {getTimeUntil()}
            </span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-primary rounded-full w-3/4 animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            size="default" 
            className="flex-1 group/btn" 
            variant="futuristic"
            onClick={handleConfirm}
            disabled={updating || nextAppointment.status === 'confirmed'}
          >
            <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
            {nextAppointment.status === 'confirmed' ? 'Confirmado' : 'Confirmar'}
          </Button>
          <Button 
            size="default" 
            variant="elegant" 
            className="flex-1 group/btn"
            onClick={handleReschedule}
            disabled={updating}
          >
            <RotateCcw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-400" />
            Reagendar
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}