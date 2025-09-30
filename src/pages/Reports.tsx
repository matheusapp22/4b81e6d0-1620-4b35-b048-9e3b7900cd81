import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Calendar, DollarSign, TrendingUp, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptionLimits } from '@/hooks/use-subscription-limits';
import { UpgradePrompt } from '@/components/ui/upgrade-prompt';

interface ReportData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  averageTicket: number;
  topServices: Array<{ name: string; count: number; revenue: number }>;
  monthlyStats: Array<{ month: string; appointments: number; revenue: number }>;
}

export function Reports() {
  const { user } = useAuth();
  const { canAccessFeature, limits } = useSubscriptionLimits();
  const [reportData, setReportData] = useState<ReportData>({
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalRevenue: 0,
    averageTicket: 0,
    topServices: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch appointments within date range
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          services (name, price)
        `)
        .eq('user_id', user?.id)
        .gte('appointment_date', dateRange.start)
        .lte('appointment_date', dateRange.end);

      if (appointmentsError) throw appointmentsError;

      // Calculate metrics
      const totalAppointments = appointments?.length || 0;
      const completedAppointments = appointments?.filter(apt => apt.status === 'completed').length || 0;
      const cancelledAppointments = appointments?.filter(apt => apt.status === 'cancelled').length || 0;
      
      const paidAppointments = appointments?.filter(apt => apt.payment_status === 'paid') || [];
      const totalRevenue = paidAppointments.reduce((sum, apt) => sum + (apt.payment_amount || 0), 0);
      const averageTicket = paidAppointments.length > 0 ? totalRevenue / paidAppointments.length : 0;

      // Top services
      const serviceStats = appointments?.reduce((acc, apt) => {
        if (apt.services?.name) {
          const existing = acc.find(s => s.name === apt.services.name);
          if (existing) {
            existing.count++;
            existing.revenue += apt.payment_amount || 0;
          } else {
            acc.push({
              name: apt.services.name,
              count: 1,
              revenue: apt.payment_amount || 0
            });
          }
        }
        return acc;
      }, [] as Array<{ name: string; count: number; revenue: number }>) || [];

      serviceStats.sort((a, b) => b.count - a.count);

      // Monthly stats (last 6 months)
      const monthlyStats = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const monthAppointments = appointments?.filter(apt => 
          apt.appointment_date >= monthStart && apt.appointment_date <= monthEnd
        ) || [];
        
        const monthRevenue = monthAppointments
          .filter(apt => apt.payment_status === 'paid')
          .reduce((sum, apt) => sum + (apt.payment_amount || 0), 0);

        monthlyStats.push({
          month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
          appointments: monthAppointments.length,
          revenue: monthRevenue
        });
      }

      setReportData({
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue,
        averageTicket,
        topServices: serviceStats.slice(0, 5),
        monthlyStats
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!canAccessFeature('can_use_analytics')) {
    return (
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center min-h-screen">
          <div className="max-w-2xl w-full">
            <UpgradePrompt
              feature="Relatórios e Analytics"
              currentPlan={limits.plan_type}
              requiredPlan="pro"
            />
          </div>
        </div>
      </div>
    );
  }

  const completionRate = reportData.totalAppointments > 0
    ? (reportData.completedAppointments / reportData.totalAppointments * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Relatórios</h1>
          <div className="flex gap-4">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg bg-background/50 backdrop-blur-sm"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg bg-background/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Agendamentos</p>
                  <p className="text-2xl font-bold">{reportData.totalAppointments}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-neon-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold">R$ {reportData.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-neon-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                  <p className="text-2xl font-bold">R$ {reportData.averageTicket.toFixed(2)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-neon-blue" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Services */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-6">Serviços Mais Populares</h2>
            <div className="space-y-4">
              {reportData.topServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.count} agendamentos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {service.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">receita</p>
                  </div>
                </div>
              ))}
              
              {reportData.topServices.length === 0 && (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum serviço encontrado no período</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Monthly Trend */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-6">Tendência Mensal</h2>
            <div className="space-y-4">
              {reportData.monthlyStats.map((month) => (
                <div key={month.month} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{month.month}</h3>
                    <p className="text-sm text-muted-foreground">{month.appointments} agendamentos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {month.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">receita</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Status dos Agendamentos</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Concluídos</span>
                <span className="font-medium text-success">{reportData.completedAppointments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cancelados</span>
                <span className="font-medium text-destructive">{reportData.cancelledAppointments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Outros</span>
                <span className="font-medium">{reportData.totalAppointments - reportData.completedAppointments - reportData.cancelledAppointments}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Resumo do Período</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Período</span>
                <span className="font-medium">
                  {new Date(dateRange.start).toLocaleDateString('pt-BR')} - {new Date(dateRange.end).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Agendamentos/dia</span>
                <span className="font-medium">
                  {((reportData.totalAppointments / Math.max(1, Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24))))).toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Receita/dia</span>
                <span className="font-medium text-success">
                  R$ {(reportData.totalRevenue / Math.max(1, Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(2)}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}