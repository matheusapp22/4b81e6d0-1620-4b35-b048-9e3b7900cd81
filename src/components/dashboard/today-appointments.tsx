import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Phone, CheckCircle, XCircle, Plus, Calendar as CalendarIcon, Users, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  start_time: string;
  end_time: string;
  status: string;
  services: {
    name: string;
    price: number;
  };
}

export function TodayAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchTodayAppointments = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            client_name,
            client_phone,
            start_time,
            end_time,
            status,
            services (
              name,
              price
            )
          `)
          .eq('user_id', user.id)
          .eq('appointment_date', today)
          .order('start_time');

        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAppointments();
  }, [user]);

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );

      toast({
        title: 'Status atualizado',
        description: `Agendamento marcado como ${getStatusLabel(status)}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status',
        variant: 'destructive'
      });
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: 'Agendado',
      confirmed: 'Confirmado',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      no_show: 'Não compareceu'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      case 'no_show': return 'warning';
      default: return 'info';
    }
  };

  if (loading) {
    return (
      <GlassCard variant="premium">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="loading-skeleton w-5 h-5 rounded"></div>
            <div className="loading-skeleton h-6 w-48 rounded"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-skeleton h-20 rounded-xl"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="premium" className="group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-headline font-semibold">Agendamentos de Hoje</h3>
            <Badge variant="secondary" className="status-badge info">
              {appointments.length}
            </Badge>
          </div>
          <Button size="sm" variant="minimal" asChild>
            <a href="/appointments">
              <Plus className="w-4 h-4" />
              Novo
            </a>
          </Button>
        </div>

        {/* Content */}
        {appointments.length === 0 ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 mx-auto bg-muted rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <CalendarIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h4 className="text-body font-semibold">Agenda livre hoje!</h4>
              <p className="text-caption max-w-sm mx-auto">
                Que tal aproveitar para revisar seus clientes ou configurar novos serviços?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="default" size="sm" asChild>
                <a href="/appointments">
                  <Plus className="w-4 h-4" />
                  Novo Agendamento
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/clients">
                  <Users className="w-4 h-4" />
                  Ver Clientes
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="premium-card p-4 group/item animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  {/* Time */}
                  <div className="text-center min-w-[60px]">
                    <p className="metric-display text-lg font-bold">
                      {appointment.start_time.slice(0, 5)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.end_time.slice(0, 5)}
                    </p>
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 mx-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-body">{appointment.client_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-caption">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span>{appointment.client_phone}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{appointment.services.name}</span>
                      <span className="metric-display text-sm text-primary">
                        R$ {appointment.services.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    <Badge className={`status-badge ${getStatusVariant(appointment.status)}`}>
                      <Activity className="w-3 h-3" />
                      {getStatusLabel(appointment.status)}
                    </Badge>
                    
                    {appointment.status === 'scheduled' && (
                      <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="h-8 w-8 p-0 hover:bg-success/10 hover:text-success"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}