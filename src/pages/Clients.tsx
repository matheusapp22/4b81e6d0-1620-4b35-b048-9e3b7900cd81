import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Phone, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BackButton } from '@/components/ui/back-button';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  created_at: string;
}

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user?.id)
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update({
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            notes: formData.notes || null
          })
          .eq('id', editingClient.id);

        if (error) throw error;
        toast({ title: 'Cliente atualizado com sucesso!' });
      } else {
        const { error } = await supabase
          .from('clients')
          .insert({
            user_id: user?.id,
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            notes: formData.notes || null
          });

        if (error) throw error;
        toast({ title: 'Cliente criado com sucesso!' });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchClients();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar cliente',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      toast({ title: 'Cliente excluído com sucesso!' });
      fetchClients();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir cliente',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      notes: ''
    });
    setEditingClient(null);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      notes: client.notes || ''
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
        <div className="mb-6">
          <BackButton to="/dashboard" />
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Clientes</h1>
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
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
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
                    {editingClient ? 'Atualizar' : 'Criar'}
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

        <div className="grid gap-4">
          {clients.map((client) => (
            <GlassCard key={client.id} className="p-6 hover-glow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{client.name}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                      {client.email && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Mail className="w-3 h-3" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Phone className="w-3 h-3" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Cliente desde
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(client.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {client.notes && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Observações:</strong> {client.notes}
                  </p>
                </div>
              )}
            </GlassCard>
          ))}
          
          {clients.length === 0 && (
            <GlassCard className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente cadastrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece cadastrando seus clientes para facilitar o agendamento.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Cliente
              </Button>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}