import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Save, Clock, User, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BusinessHour {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working: boolean;
}

const dayNames = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export function Settings() {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    business_name: '',
    phone: '',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR'
  });
  
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          business_name: profileData.business_name || '',
          phone: profileData.phone || '',
          timezone: profileData.timezone || 'America/Sao_Paulo',
          language: profileData.language || 'pt-BR'
        });
      }

      // Fetch business hours
      const { data: hoursData, error: hoursError } = await supabase
        .from('business_hours')
        .select('*')
        .eq('user_id', user?.id)
        .order('day_of_week');

      if (hoursError) throw hoursError;
      setBusinessHours(hoursData || []);

    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Usuário não autenticado',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      console.log('Atualizando perfil para user_id:', user.id);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          business_name: profile.business_name,
          phone: profile.phone,
          timezone: profile.timezone,
          language: profile.language
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw error;
      }
      
      console.log('Perfil atualizado com sucesso');
      toast({ title: 'Perfil atualizado com sucesso!' });
      await refreshProfile();
    } catch (error: any) {
      console.error('Erro no handleProfileSubmit:', error);
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleBusinessHourChange = (dayOfWeek: number, field: string, value: string | boolean) => {
    setBusinessHours(prev => 
      prev.map(hour => 
        hour.day_of_week === dayOfWeek 
          ? { ...hour, [field]: value }
          : hour
      )
    );
  };

  const handleBusinessHoursSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updates = businessHours.map(hour => ({
        id: hour.id,
        user_id: user?.id,
        day_of_week: hour.day_of_week,
        start_time: hour.start_time,
        end_time: hour.end_time,
        is_working: hour.is_working
      }));

      const { error } = await supabase
        .from('business_hours')
        .upsert(updates);

      if (error) throw error;
      
      toast({ title: 'Horários de funcionamento atualizados!' });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar horários',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-4xl mx-auto">
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-8">Configurações</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 glass-card">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="business" className="gap-2">
              <Clock className="w-4 h-4" />
              Horários
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Informações Pessoais</h2>
              </div>
              
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Nome</Label>
                    <Input
                      id="first_name"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="last_name">Sobrenome</Label>
                    <Input
                      id="last_name"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="business_name">Nome do Negócio</Label>
                  <Input
                    id="business_name"
                    value={profile.business_name}
                    onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                    placeholder="Ex: Salão da Maria, Clínica Dr. João..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Perfil
                  </Button>
                </div>
              </form>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="business">
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Horários de Funcionamento</h2>
              </div>
              
              <form onSubmit={handleBusinessHoursSubmit} className="space-y-4">
                {businessHours.map((hour) => (
                  <div key={hour.day_of_week} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg">
                    <div className="w-32">
                      <span className="font-medium">{dayNames[hour.day_of_week]}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={hour.is_working}
                        onCheckedChange={(checked) => 
                          handleBusinessHourChange(hour.day_of_week, 'is_working', checked)
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {hour.is_working ? 'Aberto' : 'Fechado'}
                      </span>
                    </div>
                    
                    {hour.is_working && (
                      <>
                        <div>
                          <Label className="text-xs">Abertura</Label>
                          <Input
                            type="time"
                            value={hour.start_time}
                            onChange={(e) => 
                              handleBusinessHourChange(hour.day_of_week, 'start_time', e.target.value)
                            }
                            className="w-24"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs">Fechamento</Label>
                          <Input
                            type="time"
                            value={hour.end_time}
                            onChange={(e) => 
                              handleBusinessHourChange(hour.day_of_week, 'end_time', e.target.value)
                            }
                            className="w-24"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Horários
                  </Button>
                </div>
              </form>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}