import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

const bookingSchema = z.object({
  client_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  client_email: z.string().email('Email inválido'),
  client_phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  notes: z.string().optional(),
});

interface BookingFormProps {
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
    color: string;
  };
  businessProfile: {
    user_id: string;
    business_name: string;
    first_name?: string;
    last_name?: string;
    timezone: string;
  };
}

export const BookingForm = ({ service, businessProfile }: BookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      client_name: '',
      client_email: '',
      client_phone: '',
      notes: '',
    },
  });

  const generateTimeSlots = () => {
    const slots = [];
    // Generate slots from 9:00 to 18:00 with service duration intervals
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += service.duration) {
        if (hour * 60 + minute + service.duration <= 18 * 60) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          slots.push(time);
        }
      }
    }
    return slots;
  };

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime('');
    
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    // Get all possible time slots
    const allSlots = generateTimeSlots();
    
    // TODO: Filter out booked slots by checking existing appointments
    // For now, show all slots as available
    setAvailableSlots(allSlots);
  };

  const onSubmit = async (values: z.infer<typeof bookingSchema>) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Erro",
        description: "Selecione uma data e horário",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: businessProfile.user_id,
          service_id: service.id,
          client_name: values.client_name,
          client_email: values.client_email,
          client_phone: values.client_phone,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: selectedTime,
          end_time: calculateEndTime(selectedTime, service.duration),
          notes: values.notes,
          status: 'scheduled',
          payment_status: 'pending',
          payment_amount: service.price,
        });

      if (error) throw error;

      toast({
        title: "Agendamento realizado!",
        description: "Seu agendamento foi confirmado. Você receberá uma confirmação em breve.",
      });

      // Reset form
      form.reset();
      setSelectedDate(undefined);
      setSelectedTime('');
      setAvailableSlots([]);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar o agendamento. Tente novamente.",
        variant: "destructive",
      });
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

  return (
    <div className="space-y-6">
      {/* Service Info */}
      <div className="border border-white/20 rounded-lg p-4 glass-card">
        <h3 className="font-semibold text-white mb-2">{service.name}</h3>
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/80 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {service.duration} minutos
          </span>
          <Badge variant="secondary" style={{ backgroundColor: service.color + '20', color: service.color }}>
            R$ {service.price}
          </Badge>
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-white font-medium mb-2">Selecione a data</label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
          className="glass-card border-white/20"
        />
      </div>

      {/* Time Selection */}
      {availableSlots.length > 0 && (
        <div>
          <label className="block text-white font-medium mb-2">Selecione o horário</label>
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot) => (
              <Button
                key={slot}
                variant={selectedTime === slot ? "neon" : "outline"}
                size="sm"
                onClick={() => setSelectedTime(slot)}
                className="text-sm"
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Client Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Nome completo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Seu nome completo" 
                    {...field} 
                    className="glass-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="seu@email.com" 
                    {...field} 
                    className="glass-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(11) 99999-9999" 
                    {...field} 
                    className="glass-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Observações (opcional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Alguma observação sobre o agendamento..." 
                    {...field} 
                    className="glass-input min-h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="neon"
            disabled={loading || !selectedDate || !selectedTime}
            className="w-full"
          >
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </Button>
        </form>
      </Form>
    </div>
  );
};