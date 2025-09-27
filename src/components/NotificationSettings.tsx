import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff } from 'lucide-react';
import { usePushNotifications } from '@/hooks/use-push-notifications';

export const NotificationSettings = () => {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  } = usePushNotifications();

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notificações Push
          </CardTitle>
          <CardDescription>
            Seu navegador não suporta notificações push
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações Push
        </CardTitle>
        <CardDescription>
          Receba notificações instantâneas quando novos agendamentos forem criados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {isSubscribed ? 'Notificações Ativadas' : 'Notificações Desativadas'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isSubscribed 
                  ? 'Você receberá notificações de novos agendamentos'
                  : 'Ative para receber alertas instantâneos'
                }
              </p>
            </div>
            <Button
              onClick={isSubscribed ? unsubscribeFromNotifications : subscribeToNotifications}
              disabled={isLoading}
              variant={isSubscribed ? "outline" : "default"}
            >
              {isLoading ? 'Processando...' : (isSubscribed ? 'Desativar' : 'Ativar')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};