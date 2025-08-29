import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { Star, Gift, Trophy, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LoyaltyClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  points_earned: number;
  points_spent: number;
  points_balance: number;
  last_activity: string;
}

interface LoyaltyTransaction {
  id: string;
  client_name: string;
  type: 'earned' | 'spent' | 'expired' | 'bonus';
  points: number;
  description?: string;
  created_at: string;
}

interface ClientSubscription {
  id: string;
  client_name: string;
  plan_type: 'basic' | 'premium' | 'vip';
  status: string;
  benefits: any;
  price: number;
  start_date: string;
  end_date?: string;
}

export function Loyalty() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loyaltyClients, setLoyaltyClients] = useState<LoyaltyClient[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<ClientSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch loyalty points with client data
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from('loyalty_points')
        .select(`
          *,
          clients:client_id (id, name, email, phone)
        `)
        .order('points_balance', { ascending: false });

      if (loyaltyError) throw loyaltyError;

      // Fetch loyalty transactions with client data
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('loyalty_transactions')
        .select(`
          *,
          clients:client_id (name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) throw transactionsError;

      // Fetch client subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('client_subscriptions')
        .select(`
          *,
          clients:client_id (name)
        `)
        .order('created_at', { ascending: false });

      if (subscriptionsError) throw subscriptionsError;

      setLoyaltyClients(loyaltyData?.map(l => ({
        id: l.id,
        name: l.clients?.name || 'N/A',
        email: l.clients?.email,
        phone: l.clients?.phone,
        points_earned: l.points_earned,
        points_spent: l.points_spent,
        points_balance: l.points_balance,
        last_activity: l.last_activity
      })) || []);

      setTransactions(transactionsData?.map(t => ({
        id: t.id,
        client_name: t.clients?.name || 'N/A',
        type: t.type as 'earned' | 'spent' | 'expired' | 'bonus',
        points: t.points,
        description: t.description,
        created_at: t.created_at
      })) || []);

      setSubscriptions(subscriptionsData?.map(s => ({
        id: s.id,
        client_name: s.clients?.name || 'N/A',
        plan_type: s.plan_type as 'basic' | 'premium' | 'vip',
        status: s.status,
        benefits: s.benefits,
        price: s.price,
        start_date: s.start_date,
        end_date: s.end_date
      })) || []);

    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de fidelidade",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'spent': return <Gift className="h-4 w-4 text-primary" />;
      case 'bonus': return <Star className="h-4 w-4 text-warning" />;
      default: return <Trophy className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'earned': return 'Ganhou';
      case 'spent': return 'Gastou';
      case 'bonus': return 'Bônus';
      case 'expired': return 'Expirou';
      default: return type;
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'vip': return 'default';
      case 'premium': return 'secondary';
      default: return 'outline';
    }
  };

  const totalPointsInCirculation = loyaltyClients.reduce((sum, client) => sum + client.points_balance, 0);
  const totalPointsEarned = loyaltyClients.reduce((sum, client) => sum + client.points_earned, 0);
  const totalPointsSpent = loyaltyClients.reduce((sum, client) => sum + client.points_spent, 0);
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Programa de Fidelidade</h1>
          <p className="text-muted-foreground">Gerencie pontos, assinaturas e recompensas dos clientes</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pontos em Circulação</p>
                <p className="text-2xl font-bold">{totalPointsInCirculation.toLocaleString()}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/20">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pontos Gerados</p>
                <p className="text-2xl font-bold">{totalPointsEarned.toLocaleString()}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/20">
                <Gift className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pontos Utilizados</p>
                <p className="text-2xl font-bold">{totalPointsSpent.toLocaleString()}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-neon-purple/20">
                <Trophy className="h-6 w-6 text-neon-purple" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assinaturas Ativas</p>
                <p className="text-2xl font-bold">{activeSubscriptions}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="points" className="space-y-6">
          <TabsList className="glass-card border-0">
            <TabsTrigger value="points">Pontos de Fidelidade</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinaturas VIP</TabsTrigger>
            <TabsTrigger value="transactions">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="points" className="space-y-4">
            {loyaltyClients.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum cliente no programa</h3>
                <p className="text-muted-foreground">
                  Os clientes ganharão pontos automaticamente a cada agendamento.
                </p>
              </GlassCard>
            ) : (
              loyaltyClients.map((client) => (
                <GlassCard key={client.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold mb-1">{client.name}</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {client.email && <p>Email: {client.email}</p>}
                          {client.phone && <p>Telefone: {client.phone}</p>}
                          <p>Última atividade: {new Date(client.last_activity).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-warning" />
                        <span className="text-2xl font-bold">{client.points_balance}</span>
                        <span className="text-sm text-muted-foreground">pontos</span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Ganhou: {client.points_earned}</p>
                        <p>Gastou: {client.points_spent}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="subscriptions" className="space-y-4">
            {subscriptions.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma assinatura ativa</h3>
                <p className="text-muted-foreground">
                  Clientes poderão assinar planos VIP para benefícios exclusivos.
                </p>
              </GlassCard>
            ) : (
              subscriptions.map((subscription) => (
                <GlassCard key={subscription.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{subscription.client_name}</h3>
                        <Badge variant={getPlanBadgeVariant(subscription.plan_type)}>
                          {subscription.plan_type.toUpperCase()}
                        </Badge>
                        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                          {subscription.status === 'active' ? 'Ativo' : subscription.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Início: {new Date(subscription.start_date).toLocaleDateString('pt-BR')}</p>
                        {subscription.end_date && (
                          <p>Fim: {new Date(subscription.end_date).toLocaleDateString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold">R$ {subscription.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">por mês</p>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            {transactions.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma transação registrada</h3>
                <p className="text-muted-foreground">
                  O histórico de pontos aparecerá aqui conforme os clientes utilizarem o programa.
                </p>
              </GlassCard>
            ) : (
              transactions.map((transaction) => (
                <GlassCard key={transaction.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(transaction.type)}
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{transaction.client_name}</h3>
                          <Badge variant="outline">
                            {getTransactionLabel(transaction.type)}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>Data: {new Date(transaction.created_at).toLocaleDateString('pt-BR')}</p>
                          {transaction.description && <p>{transaction.description}</p>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'earned' || transaction.type === 'bonus' 
                          ? 'text-success' 
                          : 'text-destructive'
                      }`}>
                        {transaction.type === 'earned' || transaction.type === 'bonus' ? '+' : '-'}
                        {transaction.points} pontos
                      </p>
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