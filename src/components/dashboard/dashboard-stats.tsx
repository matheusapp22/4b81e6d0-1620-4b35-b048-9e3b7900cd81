import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, Users, TrendingUp, TrendingDown } from 'lucide-react';
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
      bgColor: 'bg-primary/10',
      trend: '+12%',
      trendColor: 'text-green-500'
    },
    {
      title: 'Total de Clientes',
      value: stats.totalClients,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      trend: '+8%',
      trendColor: 'text-green-500'
    },
    {
      title: 'Receita do Mês',
      value: `R$ ${stats.monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      trend: '+24%',
      trendColor: 'text-green-500'
    },
    {
      title: 'Taxa de Conclusão',
      value: `${stats.completionRate}%`,
      icon: stats.completionRate >= 80 ? TrendingUp : TrendingDown,
      color: stats.completionRate >= 80 ? 'text-green-500' : 'text-yellow-500',
      bgColor: stats.completionRate >= 80 ? 'bg-green-500/10' : 'bg-yellow-500/10',
      trend: stats.completionRate >= 80 ? '+5%' : '-2%',
      trendColor: stats.completionRate >= 80 ? 'text-green-500' : 'text-yellow-500'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <Card key={stat.title} className="glass-card hover-glow transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-6 h-6 ${stat.color} animate-pulse`} />
              </div>
              <div className={`text-sm font-medium ${stat.trendColor} flex items-center gap-1`}>
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat.title}
              </p>
              <p className="text-3xl font-bold gradient-text">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}