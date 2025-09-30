import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionLimits } from '@/hooks/use-subscription-limits';
import { UpgradePrompt } from '@/components/ui/upgrade-prompt';

interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  commission_rate: number;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
}

export function Employees() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { canCreateEmployee, getRemainingCount, limits } = useSubscriptionLimits();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    commission_rate: 0,
    is_active: true
  });

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar funcionários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEmployee && !canCreateEmployee()) {
      toast({
        title: "Limite atingido",
        description: `Você atingiu o limite de funcionários do plano ${limits.plan_type.toUpperCase()}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (editingEmployee) {
        const { error } = await supabase
          .from('employees')
          .update(formData)
          .eq('id', editingEmployee.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Funcionário atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('employees')
          .insert([{ ...formData, user_id: user?.id }]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Funcionário adicionado com sucesso!",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar funcionário",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este funcionário?')) return;

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Funcionário removido com sucesso!",
      });
      
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover funcionário",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      commission_rate: 0,
      is_active: true
    });
    setEditingEmployee(null);
  };

  const openEditDialog = (employee: Employee) => {
    setFormData({
      name: employee.name,
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || '',
      commission_rate: employee.commission_rate,
      is_active: employee.is_active
    });
    setEditingEmployee(employee);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Gestão de Equipe</h1>
            <p className="text-muted-foreground">Gerencie sua equipe e comissões</p>
          </div>
          
          {!canCreateEmployee() && (
            <div className="mb-4">
              <UpgradePrompt
                feature="funcionários"
                currentPlan={limits.plan_type}
                requiredPlan={limits.employees_limit === 1 ? "pro" : "premium"}
                remaining={getRemainingCount('employees')}
                limit={limits.employees_limit}
              />
            </div>
          )}
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="gap-2" disabled={!canCreateEmployee()}>
                <Plus className="h-4 w-4" />
                Adicionar Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-0">
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="glass-input"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass-input"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="glass-input"
                  />
                </div>
                
                <div>
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="glass-input"
                  />
                </div>
                
                <div>
                  <Label htmlFor="commission_rate">Taxa de Comissão (%)</Label>
                  <Input
                    id="commission_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) || 0 })}
                    className="glass-input"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingEmployee ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Funcionários</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/20">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Funcionários Ativos</p>
                <p className="text-2xl font-bold">{employees.filter(e => e.is_active).length}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/20">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comissão Média</p>
                <p className="text-2xl font-bold">
                  {employees.length > 0 
                    ? `${(employees.reduce((acc, emp) => acc + emp.commission_rate, 0) / employees.length).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Employees List */}
        <div className="space-y-4">
          {employees.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum funcionário cadastrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando seus funcionários para gerenciar a equipe.
              </p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Primeiro Funcionário
              </Button>
            </GlassCard>
          ) : (
            employees.map((employee) => (
              <GlassCard key={employee.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={employee.avatar_url} />
                      <AvatarFallback>
                        {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{employee.name}</h3>
                        <Badge variant={employee.is_active ? "default" : "secondary"}>
                          {employee.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        {employee.position && <p>Cargo: {employee.position}</p>}
                        {employee.email && <p>Email: {employee.email}</p>}
                        {employee.phone && <p>Telefone: {employee.phone}</p>}
                        <p>Comissão: {employee.commission_rate}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditDialog(employee)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}