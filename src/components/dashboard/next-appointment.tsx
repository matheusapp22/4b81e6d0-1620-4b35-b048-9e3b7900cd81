import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, User, MapPin, Phone, Calendar as CalendarIcon } from 'lucide-react';
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
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Próximo Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nextAppointment) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Próximo Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">Nenhum agendamento próximo</p>
            <p className="text-sm text-muted-foreground">
              Que tal aproveitar para organizar sua agenda?
            </p>
            <Button variant="outline" className="mt-4" size="sm">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Ver Agenda
            </Button>
          </div>
        </CardContent>
      </Card>
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

  return (
    <Card className="glass-card hover-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Próximo Agendamento
          </div>
          <Badge variant={isToday(nextAppointment.appointment_date) ? "default" : "secondary"}>
            {isToday(nextAppointment.appointment_date) ? 'Hoje' : formatDate(nextAppointment.appointment_date)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(nextAppointment.client_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-lg truncate">
                {nextAppointment.client_name}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Phone className="w-3 h-3" />
              <span>{nextAppointment.client_phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{nextAppointment.services.name}</span>
            <span className="text-sm font-medium text-primary">
              R$ {nextAppointment.services.price.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {formatTime(nextAppointment.start_time)} - {formatTime(nextAppointment.end_time)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{nextAppointment.services.duration}min</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            Confirmar
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Reagendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}