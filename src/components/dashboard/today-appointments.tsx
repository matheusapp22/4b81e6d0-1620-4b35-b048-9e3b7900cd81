import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Phone, CheckCircle, XCircle, Plus, Calendar as CalendarIcon, Users } from 'lucide-react';
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

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      completed: 'bg-primary/10 text-primary',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      no_show: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Agendamentos de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Agendamentos de Hoje
          <Badge variant="secondary">{appointments.length}</Badge>
        </CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-12 h-12 text-primary/50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum agendamento para hoje!</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Que tal aproveitar para revisar seus clientes ou configurar novos serviços?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Ver Clientes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {appointment.start_time.slice(0, 5)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.end_time.slice(0, 5)}
                    </p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.client_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{appointment.client_phone}</span>
                    </div>
                    
                    <div className="mt-1">
                      <span className="text-sm font-medium">{appointment.services.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        R$ {appointment.services.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusLabel(appointment.status)}
                  </Badge>
                  
                  {appointment.status === 'scheduled' && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}