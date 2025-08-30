import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardGreeting } from '@/components/dashboard/dashboard-greeting';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { StatsChart } from '@/components/dashboard/stats-chart';
import { TodayAppointments } from '@/components/dashboard/today-appointments';
import { NextAppointment } from '@/components/dashboard/next-appointment';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { AppointmentModal } from '@/components/dashboard/appointment-modal';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <DashboardGreeting />
        
        <DashboardStats />
        
        <StatsChart />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TodayAppointments />
          </div>
          <div className="space-y-8">
            <NextAppointment />
            <QuickActions />
          </div>
        </div>
      </main>
      
      <AppointmentModal />
    </div>
  );
}