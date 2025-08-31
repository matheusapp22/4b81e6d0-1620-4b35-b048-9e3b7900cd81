import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Calendar, Clock, DollarSign, Users, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';

interface Stats {
  todayAppointments: number;
  totalClients: number;
  monthlyRevenue: number;
  completionRate: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    todayAppointments: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString().split('T')[0];

        // Today's appointments
        const { count: todayCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('appointment_date', today);

        // Total clients
        const { count: clientsCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Monthly revenue
        const { data: monthlyPayments } = await supabase
          .from('appointments')
          .select('payment_amount')
          .eq('user_id', user.id)
          .eq('payment_status', 'paid')
          .gte('appointment_date', startOfMonth);

        const monthlyRevenue = monthlyPayments?.reduce(
          (sum, appointment) => sum + (appointment.payment_amount || 0), 
          0
        ) || 0;

        // Completion rate (this month)
        const { count: totalAppointments } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('appointment_date', startOfMonth);

        const { count: completedAppointments } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('appointment_date', startOfMonth);

        const completionRate = totalAppointments 
          ? Math.round((completedAppointments || 0) / totalAppointments * 100)
          : 0;

        setStats({
          todayAppointments: todayCount || 0,
          totalClients: clientsCount || 0,
          monthlyRevenue,
          completionRate
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statsData = [
    {
      title: 'Agendamentos Hoje',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/8',
      trend: '+12%',
      trendColor: 'text-neon-green',
      description: 'vs. ontem'
    },
    {
      title: 'Total de Clientes',
      value: stats.totalClients,
      icon: Users,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/8',
      trend: '+8%',
      trendColor: 'text-neon-green',
      description: 'este mês'
    },
    {
      title: 'Receita do Mês',
      value: `R$ ${stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/8',
      trend: '+24%',
      trendColor: 'text-neon-green',
      description: 'vs. mês anterior'
    },
    {
      title: 'Taxa de Conclusão',
      value: `${stats.completionRate}%`,
      icon: stats.completionRate >= 80 ? TrendingUp : Activity,
      color: stats.completionRate >= 80 ? 'text-neon-green' : 'text-warning',
      bgColor: stats.completionRate >= 80 ? 'bg-neon-green/8' : 'bg-warning/8',
      trend: stats.completionRate >= 80 ? '+5%' : '-2%',
      trendColor: stats.completionRate >= 80 ? 'text-neon-green' : 'text-warning',
      description: 'este mês'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <GlassCard key={i} variant="premium" className="p-6">
            <div className="loading-skeleton h-4 w-3/4 mb-3 rounded"></div>
            <div className="loading-skeleton h-8 w-1/2 mb-2 rounded"></div>
            <div className="loading-skeleton h-3 w-2/3 rounded"></div>
          </GlassCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <GlassCard 
          key={stat.title} 
          variant="premium" 
          hover 
          className="group animate-scale-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`status-badge ${stat.trendColor.includes('green') ? 'success' : 'warning'}`}>
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <p className="text-caption text-muted-foreground">
                {stat.title}
              </p>
              <p className="metric-display gradient-text">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}