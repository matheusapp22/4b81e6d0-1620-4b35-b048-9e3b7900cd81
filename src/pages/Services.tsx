import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSubscriptionLimits } from '@/hooks/use-subscription-limits';
import { UpgradePrompt } from '@/components/ui/upgrade-prompt';

interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  color?: string;
  is_active: boolean;
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    limits, 
    usage, 
    canCreateService, 
    getRemainingCount, 
    refreshUsage 
  } = useSubscriptionLimits();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    color: '#6C63FF'
  });

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user?.id)
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check limits for new services
    if (!editingService && !canCreateService()) {
      toast({
        title: "Limite atingido!",
        description: `Você atingiu o limite de ${limits.services_limit} serviços do plano ${limits.plan_type.toUpperCase()}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update({
            name: formData.name,
            description: formData.description,
            duration: formData.duration,
            price: formData.price,
            color: formData.color
          })
          .eq('id', editingService.id);

        if (error) throw error;
        toast({ title: 'Serviço atualizado com sucesso!' });
      } else {
        const { error } = await supabase
          .from('services')
          .insert({
            user_id: user?.id,
            name: formData.name,
            description: formData.description,
            duration: formData.duration,
            price: formData.price,
            color: formData.color
          });

        if (error) throw error;
        toast({ title: 'Serviço criado com sucesso!' });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchServices();
      refreshUsage(); // Refresh usage after creating/updating service
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar serviço',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      toast({ title: 'Serviço excluído com sucesso!' });
      fetchServices();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir serviço',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 60,
      price: 0,
      color: '#6C63FF'
    });
    setEditingService(null);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      color: service.color || '#6C63FF'
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
          <div>
            <h1 className="text-3xl font-bold gradient-text">Serviços</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {usage.services_count} de {limits.services_limit === -1 ? '∞' : limits.services_limit} serviços utilizados
            </p>
          </div>
          
          {canCreateService() ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Serviço
                </Button>
              </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Serviço</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="color">Cor</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingService ? 'Atualizar' : 'Criar'}
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
          ) : (
            <Button 
              disabled
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Limite Atingido
            </Button>
          )}
        </div>

        {!canCreateService() && (
          <div className="mb-6">
            <UpgradePrompt
              feature="serviços"
              currentPlan={limits.plan_type}
              requiredPlan="pro"
              remaining={getRemainingCount('services')}
              limit={limits.services_limit}
              onUpgrade={() => {
                // Implementar redirecionamento para upgrade
                toast({
                  title: "Upgrade em breve!",
                  description: "A funcionalidade de upgrade estará disponível em breve.",
                });
              }}
            />
          </div>
        )}

        <div className="grid gap-4">
          {services.map((service) => (
            <GlassCard key={service.id} className="p-6 hover-glow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: service.color }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    {service.description && (
                      <p className="text-muted-foreground">{service.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} min</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-success">
                    <DollarSign className="w-4 h-4" />
                    <span>R$ {service.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(service)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
          
          {services.length === 0 && (
            <GlassCard className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum serviço cadastrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro serviço para começar a agendar.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Serviço
              </Button>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}