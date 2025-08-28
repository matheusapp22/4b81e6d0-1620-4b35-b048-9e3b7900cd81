import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Clock, User, Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  client_name: string;
  status: string;
  payment_status: string;
  payment_amount?: number;
  services?: { name: string; color?: string };
}

const statusColors = {
  scheduled: 'bg-primary/20 text-primary',
  confirmed: 'bg-neon-green/20 text-neon-green',
  completed: 'bg-success/20 text-success',
  cancelled: 'bg-destructive/20 text-destructive',
  no_show: 'bg-warning/20 text-warning'
};

const statusLabels = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado', 
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'Não Compareceu'
};

export function Calendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, selectedDate]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services (name, color)
        `)
        .eq('user_id', user?.id)
        .eq('appointment_date', selectedDate)
        .order('start_time');

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.services?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeString);
    }
    return slots;
  };

  const getAppointmentForTime = (timeSlot: string) => {
    return filteredAppointments.find(apt => apt.start_time === timeSlot);
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Agenda</h1>
          <Button asChild>
            <a href="/appointments">
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </a>
          </Button>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Data</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cliente ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                  <SelectItem value="no_show">Não Compareceu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={fetchAppointments}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Calendar Grid */}
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {new Date(selectedDate).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredAppointments.length} agendamento(s)
            </div>
          </div>

          <div className="space-y-2">
            {generateTimeSlots().map((timeSlot) => {
              const appointment = getAppointmentForTime(timeSlot);
              
              return (
                <div key={timeSlot} className="flex items-center gap-4 p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-16 text-sm font-medium text-muted-foreground">
                    {formatTime(timeSlot)}
                  </div>
                  
                  {appointment ? (
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: appointment.services?.color || '#6C63FF' }}
                        />
                        <div>
                          <h4 className="font-medium">{appointment.client_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.services?.name} • {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                          {statusLabels[appointment.status as keyof typeof statusLabels]}
                        </Badge>
                        {appointment.payment_amount && (
                          <span className="text-sm text-success font-medium">
                            R$ {appointment.payment_amount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 text-sm text-muted-foreground italic">
                      Horário disponível
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Não há agendamentos para esta data ou filtros aplicados.
              </p>
              <Button asChild>
                <a href="/appointments">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Agendamento
                </a>
              </Button>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}