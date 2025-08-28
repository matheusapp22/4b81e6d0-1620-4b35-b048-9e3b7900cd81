import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';
import { PricingSection } from '@/components/pricing-section';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
    </div>
  );
};

export default Index;
