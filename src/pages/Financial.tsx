import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CashFlowEntry {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
}

interface Commission {
  id: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paid_at?: string;
  employee_name: string;
  appointment_date: string;
  client_name: string;
}

export function Financial() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cashFlow, setCashFlow] = useState<CashFlowEntry[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    income: ['Serviços', 'Produtos', 'Outros'],
    expense: ['Aluguel', 'Materiais', 'Funcionários', 'Marketing', 'Outros']
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch cash flow
      const { data: cashFlowData, error: cashFlowError } = await supabase
        .from('cash_flow')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (cashFlowError) throw cashFlowError;

      // Fetch commissions with employee and appointment data
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('commissions')
        .select(`
          *,
          employees:employee_id (name),
          appointments:appointment_id (appointment_date, client_name)
        `)
        .order('created_at', { ascending: false });

      if (commissionsError) throw commissionsError;

      setCashFlow(cashFlowData || []);
      setCommissions(commissionsData?.map(c => ({
        id: c.id,
        amount: c.amount,
        status: c.status as 'pending' | 'paid' | 'cancelled',
        paid_at: c.paid_at,
        employee_name: c.employees?.name || 'N/A',
        appointment_date: c.appointments?.appointment_date || '',
        client_name: c.appointments?.client_name || 'N/A'
      })) || []);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados financeiros",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('cash_flow')
        .insert([{ ...formData, user_id: user?.id }]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Entrada adicionada com sucesso!",
      });

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving cash flow entry:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar entrada",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'income',
      category: '',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const calculateTotals = () => {
    const totalIncome = cashFlow.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = cashFlow.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, balance };
  };

  const { totalIncome, totalExpenses, balance } = calculateTotals();
  const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);

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
            <h1 className="text-3xl font-bold gradient-text mb-2">Gestão Financeira</h1>
            <p className="text-muted-foreground">Controle seu fluxo de caixa e comissões</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Entrada
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-0">
              <DialogHeader>
                <DialogTitle>Nova Entrada Financeira</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value, category: '' })}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[formData.type].map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="amount">Valor *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    required
                    className="glass-input"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="glass-input"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="glass-input"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Adicionar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/20">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receitas</p>
                <p className="text-xl font-bold text-success">R$ {totalIncome.toFixed(2)}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/20">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Despesas</p>
                <p className="text-xl font-bold text-destructive">R$ {totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${balance >= 0 ? 'bg-primary/20' : 'bg-warning/20'}`}>
                <DollarSign className={`h-6 w-6 ${balance >= 0 ? 'text-primary' : 'text-warning'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className={`text-xl font-bold ${balance >= 0 ? 'text-primary' : 'text-warning'}`}>
                  R$ {balance.toFixed(2)}
                </p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/20">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comissões Pendentes</p>
                <p className="text-xl font-bold text-warning">R$ {pendingCommissions.toFixed(2)}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tabs for Cash Flow and Commissions */}
        <Tabs defaultValue="cashflow" className="space-y-6">
          <TabsList className="glass-card border-0">
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="commissions">Comissões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cashflow" className="space-y-4">
            {cashFlow.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma entrada registrada</h3>
                <p className="text-muted-foreground mb-4">
                  Comece registrando suas receitas e despesas.
                </p>
                <Button onClick={() => setDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Primeira Entrada
                </Button>
              </GlassCard>
            ) : (
              cashFlow.map((entry) => (
                <GlassCard key={entry.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${entry.type === 'income' ? 'bg-success/20' : 'bg-destructive/20'}`}>
                        {entry.type === 'income' ? 
                          <TrendingUp className="h-6 w-6 text-success" /> : 
                          <TrendingDown className="h-6 w-6 text-destructive" />
                        }
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{entry.category}</h3>
                          <Badge variant={entry.type === 'income' ? "default" : "destructive"}>
                            {entry.type === 'income' ? 'Receita' : 'Despesa'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>Data: {new Date(entry.date).toLocaleDateString('pt-BR')}</p>
                          {entry.description && <p>Descrição: {entry.description}</p>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-xl font-bold ${entry.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                        {entry.type === 'income' ? '+' : '-'} R$ {entry.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="commissions" className="space-y-4">
            {commissions.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma comissão registrada</h3>
                <p className="text-muted-foreground">
                  As comissões serão geradas automaticamente baseadas nos agendamentos.
                </p>
              </GlassCard>
            ) : (
              commissions.map((commission) => (
                <GlassCard key={commission.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{commission.employee_name}</h3>
                        <Badge 
                          variant={
                            commission.status === 'paid' ? 'default' : 
                            commission.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {commission.status === 'paid' ? 'Pago' : 
                           commission.status === 'pending' ? 'Pendente' : 'Cancelado'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Cliente: {commission.client_name}</p>
                        <p>Data: {new Date(commission.appointment_date).toLocaleDateString('pt-BR')}</p>
                        {commission.paid_at && (
                          <p>Pago em: {new Date(commission.paid_at).toLocaleDateString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold">R$ {commission.amount.toFixed(2)}</p>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}