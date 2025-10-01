import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Send, Users, Gift, Zap, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubscriptionLimits } from '@/hooks/use-subscription-limits';
import { UpgradePrompt } from '@/components/ui/upgrade-prompt';
import { BackButton } from '@/components/ui/back-button';

interface Campaign {
  id: string;
  name: string;
  type: 'reactivation' | 'birthday' | 'anniversary' | 'promotion' | 'custom';
  message_template?: string;
  discount_percentage?: number;
  discount_amount?: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

interface Promotion {
  id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed' | 'buy_x_get_y';
  discount_value: number;
  min_amount?: number;
  max_uses?: number;
  current_uses: number;
  is_flash: boolean;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

interface Referral {
  id: string;
  referrer_name: string;
  referred_name?: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'rewarded';
  reward_points: number;
  created_at: string;
  completed_at?: string;
}

export function Marketing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { canAccessFeature, limits } = useSubscriptionLimits();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'custom' as const,
    message_template: '',
    discount_percentage: 0,
    discount_amount: 0,
    start_date: '',
    end_date: ''
  });

  const [promotionForm, setPromotionForm] = useState({
    title: '',
    description: '',
    discount_type: 'percentage' as const,
    discount_value: 0,
    min_amount: 0,
    max_uses: 0,
    is_flash: false,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      // Fetch promotions
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (promotionsError) throw promotionsError;

      // Fetch referrals with client data
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;

      setCampaigns(campaignsData?.map(c => ({ ...c, type: c.type as any })) || []);
      setPromotions(promotionsData?.map(p => ({ ...p, discount_type: p.discount_type as any })) || []);
      setReferrals(referralsData?.map(r => ({
        id: r.id,
        referrer_name: 'Cliente',
        referred_name: undefined,
        referral_code: r.referral_code || '',
        status: r.status as 'pending' | 'completed' | 'rewarded',
        reward_points: r.reward_points,
        created_at: r.created_at,
        completed_at: r.completed_at
      })) || []);

    } catch (error) {
      console.error('Error fetching marketing data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de marketing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .insert([{ ...campaignForm, user_id: user?.id, is_active: true }]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Campanha criada com sucesso!",
      });

      setCampaignDialogOpen(false);
      resetCampaignForm();
      fetchData();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar campanha",
        variant: "destructive",
      });
    }
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('promotions')
        .insert([{ 
          ...promotionForm, 
          user_id: user?.id, 
          current_uses: 0,
          is_active: true 
        }]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Promoção criada com sucesso!",
      });

      setPromotionDialogOpen(false);
      resetPromotionForm();
      fetchData();
    } catch (error) {
      console.error('Error creating promotion:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar promoção",
        variant: "destructive",
      });
    }
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      name: '',
      type: 'custom',
      message_template: '',
      discount_percentage: 0,
      discount_amount: 0,
      start_date: '',
      end_date: ''
    });
  };

  const resetPromotionForm = () => {
    setPromotionForm({
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_amount: 0,
      max_uses: 0,
      is_flash: false,
      start_date: '',
      end_date: ''
    });
  };

  const getCampaignTypeLabel = (type: string) => {
    switch (type) {
      case 'reactivation': return 'Reativação';
      case 'birthday': return 'Aniversário';
      case 'anniversary': return 'Aniversário da Empresa';
      case 'promotion': return 'Promoção';
      default: return 'Personalizada';
    }
  };

  const activeCampaigns = campaigns.filter(c => c.is_active).length;
  const activePromotions = promotions.filter(p => p.is_active).length;
  const completedReferrals = referrals.filter(r => r.status === 'completed').length;
  const totalReferralRewards = referrals.reduce((sum, r) => sum + r.reward_points, 0);

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

  if (!canAccessFeature('can_use_marketing')) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <UpgradePrompt
              feature="Marketing & Campanhas"
              currentPlan={limits.plan_type}
              requiredPlan="pro"
            />
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Marketing & Campanhas</h1>
            <p className="text-muted-foreground">Gerencie campanhas, promoções e programa de indicações</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Campanhas Ativas</p>
                <p className="text-2xl font-bold">{activeCampaigns}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/20">
                <Zap className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promoções Ativas</p>
                <p className="text-2xl font-bold">{activePromotions}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/20">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Indicações Concluídas</p>
                <p className="text-2xl font-bold">{completedReferrals}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-neon-purple/20">
                <Gift className="h-6 w-6 text-neon-purple" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pontos de Indicação</p>
                <p className="text-2xl font-bold">{totalReferralRewards}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="glass-card border-0">
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="promotions">Promoções</TabsTrigger>
            <TabsTrigger value="referrals">Indicações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetCampaignForm()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Campanha
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-0 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Nova Campanha</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleCampaignSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome da Campanha *</Label>
                      <Input
                        id="name"
                        value={campaignForm.name}
                        onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                        required
                        className="glass-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Tipo de Campanha *</Label>
                      <Select value={campaignForm.type} onValueChange={(value: any) => setCampaignForm({ ...campaignForm, type: value })}>
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reactivation">Reativação de Clientes</SelectItem>
                          <SelectItem value="birthday">Aniversário do Cliente</SelectItem>
                          <SelectItem value="anniversary">Aniversário da Empresa</SelectItem>
                          <SelectItem value="promotion">Promoção</SelectItem>
                          <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="message_template">Modelo de Mensagem</Label>
                      <Textarea
                        id="message_template"
                        value={campaignForm.message_template}
                        onChange={(e) => setCampaignForm({ ...campaignForm, message_template: e.target.value })}
                        placeholder="Digite a mensagem que será enviada aos clientes..."
                        className="glass-input"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="discount_percentage">Desconto (%)</Label>
                        <Input
                          id="discount_percentage"
                          type="number"
                          min="0"
                          max="100"
                          value={campaignForm.discount_percentage}
                          onChange={(e) => setCampaignForm({ ...campaignForm, discount_percentage: parseFloat(e.target.value) || 0 })}
                          className="glass-input"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="discount_amount">Desconto (R$)</Label>
                        <Input
                          id="discount_amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={campaignForm.discount_amount}
                          onChange={(e) => setCampaignForm({ ...campaignForm, discount_amount: parseFloat(e.target.value) || 0 })}
                          className="glass-input"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_date">Data de Início</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={campaignForm.start_date}
                          onChange={(e) => setCampaignForm({ ...campaignForm, start_date: e.target.value })}
                          className="glass-input"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="end_date">Data de Fim</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={campaignForm.end_date}
                          onChange={(e) => setCampaignForm({ ...campaignForm, end_date: e.target.value })}
                          className="glass-input"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setCampaignDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Criar Campanha</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {campaigns.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma campanha criada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie campanhas automatizadas para engajar seus clientes.
                </p>
                <Button onClick={() => setCampaignDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Primeira Campanha
                </Button>
              </GlassCard>
            ) : (
              campaigns.map((campaign) => (
                <GlassCard key={campaign.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <Badge variant={campaign.is_active ? 'default' : 'secondary'}>
                          {campaign.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                        <Badge variant="outline">
                          {getCampaignTypeLabel(campaign.type)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Criada em: {new Date(campaign.created_at).toLocaleDateString('pt-BR')}</p>
                        {campaign.start_date && (
                          <p>Período: {new Date(campaign.start_date).toLocaleDateString('pt-BR')} - {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('pt-BR') : 'Indefinido'}</p>
                        )}
                        {(campaign.discount_percentage > 0 || campaign.discount_amount > 0) && (
                          <p>Desconto: {campaign.discount_percentage > 0 ? `${campaign.discount_percentage}%` : `R$ ${campaign.discount_amount}`}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="promotions" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={promotionDialogOpen} onOpenChange={setPromotionDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetPromotionForm()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Promoção
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-0 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Nova Promoção</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handlePromotionSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="promotion_title">Título da Promoção *</Label>
                      <Input
                        id="promotion_title"
                        value={promotionForm.title}
                        onChange={(e) => setPromotionForm({ ...promotionForm, title: e.target.value })}
                        required
                        className="glass-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="promotion_description">Descrição</Label>
                      <Textarea
                        id="promotion_description"
                        value={promotionForm.description}
                        onChange={(e) => setPromotionForm({ ...promotionForm, description: e.target.value })}
                        className="glass-input"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="promotion_discount_type">Tipo de Desconto *</Label>
                        <Select value={promotionForm.discount_type} onValueChange={(value: any) => setPromotionForm({ ...promotionForm, discount_type: value })}>
                          <SelectTrigger className="glass-input">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Porcentagem</SelectItem>
                            <SelectItem value="fixed">Valor Fixo</SelectItem>
                            <SelectItem value="buy_x_get_y">Compre X Leve Y</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="promotion_discount_value">Valor do Desconto *</Label>
                        <Input
                          id="promotion_discount_value"
                          type="number"
                          min="0"
                          step="0.01"
                          value={promotionForm.discount_value}
                          onChange={(e) => setPromotionForm({ ...promotionForm, discount_value: parseFloat(e.target.value) || 0 })}
                          required
                          className="glass-input"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="promotion_min_amount">Valor Mínimo</Label>
                        <Input
                          id="promotion_min_amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={promotionForm.min_amount}
                          onChange={(e) => setPromotionForm({ ...promotionForm, min_amount: parseFloat(e.target.value) || 0 })}
                          className="glass-input"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="promotion_max_uses">Limite de Usos</Label>
                        <Input
                          id="promotion_max_uses"
                          type="number"
                          min="0"
                          value={promotionForm.max_uses}
                          onChange={(e) => setPromotionForm({ ...promotionForm, max_uses: parseInt(e.target.value) || 0 })}
                          className="glass-input"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="promotion_start_date">Data de Início *</Label>
                        <Input
                          id="promotion_start_date"
                          type="datetime-local"
                          value={promotionForm.start_date}
                          onChange={(e) => setPromotionForm({ ...promotionForm, start_date: e.target.value })}
                          required
                          className="glass-input"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="promotion_end_date">Data de Fim *</Label>
                        <Input
                          id="promotion_end_date"
                          type="datetime-local"
                          value={promotionForm.end_date}
                          onChange={(e) => setPromotionForm({ ...promotionForm, end_date: e.target.value })}
                          required
                          className="glass-input"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setPromotionDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Criar Promoção</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {promotions.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma promoção criada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie promoções atrativas para seus clientes.
                </p>
                <Button onClick={() => setPromotionDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Primeira Promoção
                </Button>
              </GlassCard>
            ) : (
              promotions.map((promotion) => (
                <GlassCard key={promotion.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{promotion.title}</h3>
                        <Badge variant={promotion.is_active ? 'default' : 'secondary'}>
                          {promotion.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                        {promotion.is_flash && (
                          <Badge variant="destructive">Oferta Relâmpago</Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        {promotion.description && <p>{promotion.description}</p>}
                        <p>Desconto: {promotion.discount_type === 'percentage' ? `${promotion.discount_value}%` : `R$ ${promotion.discount_value}`}</p>
                        <p>Usos: {promotion.current_uses}/{promotion.max_uses || '∞'}</p>
                        <p>Válido: {new Date(promotion.start_date).toLocaleDateString('pt-BR')} - {new Date(promotion.end_date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="referrals" className="space-y-4">
            {referrals.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma indicação registrada</h3>
                <p className="text-muted-foreground">
                  As indicações aparecerão aqui quando os clientes compartilharem seus códigos.
                </p>
              </GlassCard>
            ) : (
              referrals.map((referral) => (
                <GlassCard key={referral.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{referral.referrer_name}</h3>
                        <Badge variant="outline">
                          Código: {referral.referral_code}
                        </Badge>
                        <Badge 
                          variant={
                            referral.status === 'completed' ? 'default' : 
                            referral.status === 'rewarded' ? 'secondary' : 'outline'
                          }
                        >
                          {referral.status === 'completed' ? 'Concluída' : 
                           referral.status === 'rewarded' ? 'Recompensada' : 'Pendente'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Criada em: {new Date(referral.created_at).toLocaleDateString('pt-BR')}</p>
                        {referral.referred_name && <p>Indicado: {referral.referred_name}</p>}
                        {referral.completed_at && (
                          <p>Concluída em: {new Date(referral.completed_at).toLocaleDateString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-warning">
                        {referral.reward_points} pontos
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