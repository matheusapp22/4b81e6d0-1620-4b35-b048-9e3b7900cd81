import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardGreeting } from '@/components/dashboard/dashboard-greeting';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { TopGoalsBar } from '@/components/dashboard/top-goals-bar';
import { StatsChart } from '@/components/dashboard/stats-chart';
import { TodayAppointments } from '@/components/dashboard/today-appointments';
import { NextAppointment } from '@/components/dashboard/next-appointment';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { AppointmentModal } from '@/components/dashboard/appointment-modal';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useScrollAnimation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-caption font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Top Goals Bar */}
      <TopGoalsBar />
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/3 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-40 left-20 w-48 h-48 bg-info/3 rounded-full blur-2xl animate-pulse"></div>
      
      <DashboardHeader />
      
      <main className="container mx-auto px-6 lg:px-8 py-12 space-y-12 relative z-10 mt-12">
        <div className="animate-slide-up">
          <DashboardGreeting />
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <DashboardStats />
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <StatsChart />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="xl:col-span-2 space-y-12">
            <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <TodayAppointments />
            </div>
          </div>
          <div className="space-y-12">
            <div className="animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <NextAppointment />
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
      
      <AppointmentModal />
    </div>
  );
}