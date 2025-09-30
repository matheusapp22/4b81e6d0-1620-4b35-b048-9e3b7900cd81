import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Calendar, Clock, User, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionLimits } from '@/hooks/use-subscription-limits';
import { UpgradePrompt } from '@/components/ui/upgrade-prompt';

interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  service_id: string;
  status: string;
  notes?: string;
  payment_status: string;
  payment_amount?: number;
  services?: { name: string; price: number; duration: number; color?: string };
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  color?: string;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

const statusColors = {
  scheduled: 'bg-primary/20 text-primary',
  confirmed: 'bg-neon-green/20 text-neon-green',
  completed: 'bg-success/20 text-success',
  cancelled: 'bg-destructive/20 text-destructive',
  no_show: 'bg-warning/20 text-warning'
};

const paymentStatusColors = {
  pending: 'bg-warning/20 text-warning',
  paid: 'bg-success/20 text-success',
  cancelled: 'bg-destructive/20 text-destructive'
};

export function Appointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { canCreateAppointment, getRemainingCount, limits } = useSubscriptionLimits();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    appointment_date: '',
    start_time: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    service_id: '',
    status: 'scheduled',
    notes: '',
    payment_status: 'pending',
    payment_amount: 0
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [appointmentsRes, servicesRes, clientsRes] = await Promise.all([
        supabase
          .from('appointments')
          .select(`
            *,
            services (name, price, duration, color)
          `)
          .eq('user_id', user?.id)
          .order('appointment_date', { ascending: false })
          .order('start_time', { ascending: true }),
        
        supabase
          .from('services')
          .select('*')
          .eq('user_id', user?.id)
          .eq('is_active', true)
          .order('name'),
        
        supabase
          .from('clients')
          .select('*')
          .eq('user_id', user?.id)
          .order('name')
      ]);

      if (appointmentsRes.error) throw appointmentsRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (clientsRes.error) throw clientsRes.error;

      setAppointments(appointmentsRes.data || []);
      setServices(servicesRes.data || []);
      setClients(clientsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setFormData(prev => ({
        ...prev,
        service_id: serviceId,
        payment_amount: service.price
      }));
    }
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData(prev => ({
        ...prev,
        client_name: client.name,
        client_email: client.email || '',
        client_phone: client.phone || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAppointment && !canCreateAppointment()) {
      toast({
        title: "Limite atingido",
        description: `Você atingiu o limite de agendamentos do plano ${limits.plan_type.toUpperCase()}`,
        variant: "destructive",
      });
      return;
    }
    
    const selectedService = services.find(s => s.id === formData.service_id);
    if (!selectedService) {
      toast({
        title: 'Erro',
        description: 'Selecione um serviço válido',
        variant: 'destructive'
      });
      return;
    }

    const endTime = calculateEndTime(formData.start_time, selectedService.duration);
    
    try {
      if (editingAppointment) {
        const { error } = await supabase
          .from('appointments')
          .update({
            appointment_date: formData.appointment_date,
            start_time: formData.start_time,
            end_time: endTime,
            client_name: formData.client_name,
            client_email: formData.client_email || null,
            client_phone: formData.client_phone || null,
            service_id: formData.service_id,
            status: formData.status,
            notes: formData.notes || null,
            payment_status: formData.payment_status,
            payment_amount: formData.payment_amount
          })
          .eq('id', editingAppointment.id);

        if (error) throw error;
        toast({ title: 'Agendamento atualizado com sucesso!' });
      } else {
        const { error } = await supabase
          .from('appointments')
          .insert({
            user_id: user?.id,
            appointment_date: formData.appointment_date,
            start_time: formData.start_time,
            end_time: endTime,
            client_name: formData.client_name,
            client_email: formData.client_email || null,
            client_phone: formData.client_phone || null,
            service_id: formData.service_id,
            status: formData.status,
            notes: formData.notes || null,
            payment_status: formData.payment_status,
            payment_amount: formData.payment_amount
          });

        if (error) throw error;
        toast({ title: 'Agendamento criado com sucesso!' });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar agendamento',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;
      toast({ title: 'Agendamento excluído com sucesso!' });
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir agendamento',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      appointment_date: '',
      start_time: '',
      client_name: '',
      client_email: '',
      client_phone: '',
      service_id: '',
      status: 'scheduled',
      notes: '',
      payment_status: 'pending',
      payment_amount: 0
    });
    setEditingAppointment(null);
  };

  const openEditDialog = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      appointment_date: appointment.appointment_date,
      start_time: appointment.start_time,
      client_name: appointment.client_name,
      client_email: appointment.client_email || '',
      client_phone: appointment.client_phone || '',
      service_id: appointment.service_id,
      status: appointment.status,
      notes: appointment.notes || '',
      payment_status: appointment.payment_status,
      payment_amount: appointment.payment_amount || 0
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Agendamentos</h1>
          <div className="flex flex-col items-end gap-4">
            {!canCreateAppointment() && (
              <UpgradePrompt
                feature="agendamentos"
                currentPlan={limits.plan_type}
                requiredPlan={limits.appointments_per_month === 20 ? "pro" : "premium"}
                remaining={getRemainingCount('appointments')}
                limit={limits.appointments_per_month}
              />
            )}
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="gap-2"
                  disabled={!canCreateAppointment()}
                >
                  <Plus className="w-4 h-4" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
                  </DialogTitle>
                </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appointment_date">Data</Label>
                    <Input
                      id="appointment_date"
                      type="date"
                      value={formData.appointment_date}
                      onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="start_time">Horário</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service_id">Serviço</Label>
                  <Select value={formData.service_id} onValueChange={handleServiceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.duration}min - R$ {service.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cliente Existente</Label>
                  <Select onValueChange={handleClientSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ou selecione um cliente existente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="client_name">Nome do Cliente</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_email">Email</Label>
                    <Input
                      id="client_email"
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="client_phone">Telefone</Label>
                    <Input
                      id="client_phone"
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Agendado</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                        <SelectItem value="no_show">Não Compareceu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="payment_status">Pagamento</Label>
                    <Select value={formData.payment_status} onValueChange={(value) => setFormData({ ...formData, payment_status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="payment_amount">Valor (R$)</Label>
                    <Input
                      id="payment_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.payment_amount}
                      onChange={(e) => setFormData({ ...formData, payment_amount: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingAppointment ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <GlassCard key={appointment.id} className="p-6 hover-glow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: appointment.services?.color || '#6C63FF' }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{appointment.client_name}</h3>
                    <p className="text-muted-foreground">{appointment.services?.name}</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {appointment.start_time} - {appointment.end_time}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="w-3 h-3" />
                        R$ {appointment.payment_amount?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2">
                    <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                      {appointment.status === 'scheduled' && 'Agendado'}
                      {appointment.status === 'confirmed' && 'Confirmado'}
                      {appointment.status === 'completed' && 'Concluído'}
                      {appointment.status === 'cancelled' && 'Cancelado'}
                      {appointment.status === 'no_show' && 'Não Compareceu'}
                    </Badge>
                    <Badge className={paymentStatusColors[appointment.payment_status as keyof typeof paymentStatusColors]}>
                      {appointment.payment_status === 'pending' && 'Pendente'}
                      {appointment.payment_status === 'paid' && 'Pago'}
                      {appointment.payment_status === 'cancelled' && 'Cancelado'}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(appointment)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {appointment.notes && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Observações:</strong> {appointment.notes}
                  </p>
                </div>
              )}
            </GlassCard>
          ))}
          
          {appointments.length === 0 && (
            <GlassCard className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro agendamento.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Agendamento
              </Button>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}