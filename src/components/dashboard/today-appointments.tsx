import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Phone, CheckCircle, XCircle, Plus, Calendar as CalendarIcon, Users, Activity, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

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
  useScrollAnimation();

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
      // Get appointment details before updating for email notification
      const appointment = appointments.find(apt => apt.id === appointmentId);
      
      let updateData: any = { status };
      
      // If cancelling, also update payment_status to remove from revenue
      if (status === 'cancelled') {
        updateData.payment_status = 'cancelled';
      }
      
      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId);

      if (error) throw error;

      // Send cancellation email if status is cancelled
      if (status === 'cancelled' && appointment) {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('email, business_name')
            .eq('user_id', user?.id)
            .single();

          if (profileData) {
            const today = new Date().toISOString().split('T')[0];
            
            await supabase.functions.invoke('send-notification', {
              body: {
                type: 'appointment_cancelled',
                businessEmail: profileData.email,
                businessName: profileData.business_name || 'Seu Negócio',
                clientName: appointment.client_name,
                serviceName: appointment.services.name,
                appointmentDate: today,
                appointmentTime: appointment.start_time,
                servicePrice: appointment.services.price,
                clientPhone: appointment.client_phone,
              }
            });
            console.log('Cancellation notification email sent');
          }
        } catch (emailError) {
          console.error('Error sending cancellation email:', emailError);
          // Don't throw here - status update was successful even if email failed
        }
      }

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status, ...updateData } : apt
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
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="loading-skeleton w-6 h-6 rounded-xl"></div>
            <div className="loading-skeleton h-6 w-48 rounded"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-skeleton h-24 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="premium" className="group">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-400 shadow-card">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div className="flex items-center gap-3">
              <h3 className="text-title font-bold">Agendamentos de Hoje</h3>
              <Badge className="status-indicator info px-3 py-1">
                <Activity className="w-3 h-3" />
                {appointments.length}
              </Badge>
            </div>
          </div>
          <Button size="sm" variant="elegant" asChild className="group hover:scale-105 transition-all duration-300">
            <Link to="/appointments">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Novo
            </Link>
          </Button>
        </div>

        {/* Content */}
        {appointments.length === 0 ? (
          <div className="text-center py-16 space-y-8">
            <div className="relative">
              <div className="w-28 h-28 mx-auto bg-muted rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-card">
                <CalendarIcon className="w-14 h-14 text-muted-foreground" />
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center animate-bounce-subtle">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-body font-bold">Agenda livre hoje!</h4>
              <p className="text-caption max-w-md mx-auto leading-relaxed">
                Momento perfeito para se organizar, revisar clientes ou planejar campanhas de marketing.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button variant="futuristic" size="default" asChild className="flex-1 group hover:scale-105 transition-all duration-300">
                <Link to="/appointments">
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  Novo Agendamento
                </Link>
              </Button>
              <Button variant="elegant" size="default" asChild className="flex-1 group hover:scale-105 transition-all duration-300">
                <Link to="/clients">
                  <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Ver Clientes
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="premium-card p-6 group/item animate-scale-in hover:scale-[1.02] transition-all duration-400"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  {/* Time Display */}
                  <div className="text-center min-w-[80px]">
                    <p className="metric-display text-2xl font-bold text-primary">
                      {appointment.start_time.slice(0, 5)}
                    </p>
                    <p className="text-micro text-muted-foreground font-medium">
                      {appointment.end_time.slice(0, 5)}
                    </p>
                  </div>
                  
                  {/* Client Details */}
                  <div className="flex-1 mx-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold text-body">{appointment.client_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-caption">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.client_phone}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-semibold">{appointment.services.name}</span>
                      <span className="metric-display text-lg text-success font-bold">
                        R$ {appointment.services.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-4">
                    <Badge className={`status-indicator ${getStatusVariant(appointment.status)} px-3 py-1`}>
                      <Activity className="w-3 h-3" />
                      {getStatusLabel(appointment.status)}
                    </Badge>
                    
                    {appointment.status === 'scheduled' && (
                      <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all duration-400">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="h-10 w-10 p-0 hover:bg-success/10 hover:text-success rounded-xl hover:scale-110 transition-all duration-300"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive rounded-xl hover:scale-110 transition-all duration-300"
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