import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Upload, Clock, Save, Eye, Image as ImageIcon, User, Link2, Copy, Share2, QrCode } from 'lucide-react';

interface BusinessHours {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working: boolean;
}

export const BioLinkEditor = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    business_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
  });

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    fetchBusinessHours();
  }, [user]);

  const fetchBusinessHours = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('user_id', user.id)
        .order('day_of_week');

      if (error) throw error;
      setBusinessHours(data || []);
    } catch (error) {
      console.error('Error fetching business hours:', error);
    }
  };

  const uploadImage = async (file: File, bucket: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let avatarUrl = profile?.avatar_url;
      let bannerUrl = profile?.banner_url;

      // Upload avatar if selected
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile, 'avatars');
      }

      // Upload banner if selected
      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, 'banners');
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas alterações foram salvas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessHours = async (dayIndex: number, field: keyof BusinessHours, value: any) => {
    const updatedHours = [...businessHours];
    const dayHour = updatedHours.find(h => h.day_of_week === dayIndex);
    
    if (dayHour) {
      (dayHour as any)[field] = value;
      
      try {
        const { error } = await supabase
          .from('business_hours')
          .update({ [field]: value })
          .eq('id', dayHour.id);

        if (error) throw error;
        setBusinessHours(updatedHours);
      } catch (error) {
        console.error('Error updating business hours:', error);
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const shareLink = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${formData.business_name || formData.first_name} - Agendamentos`,
          text: 'Agende seu horário comigo!',
          url: url,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const generateQRCode = (url: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    return qrUrl;
  };

  const bioLinkUrl = formData.business_name ? `/bio/${formData.business_name}` : '';
  const fullBioLinkUrl = formData.business_name ? `${window.location.origin}/bio/${formData.business_name}` : '';

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Editor do BioLink</h1>
          <p className="text-muted-foreground">Personalize sua página pública de agendamentos</p>
        </div>
        <div className="flex gap-3">
          {bioLinkUrl && (
            <Button variant="outline" asChild>
              <a href={bioLinkUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </a>
            </Button>
          )}
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações do Perfil
          </h2>
          
          <div className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : profile?.avatar_url} />
                <AvatarFallback>
                  {formData.business_name ? formData.business_name[0] : formData.first_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-accent">
                    <Upload className="w-4 h-4" />
                    Foto de Perfil
                  </div>
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <Label htmlFor="banner" className="text-sm font-medium">Banner</Label>
              <div className="mt-2">
                {(bannerFile || profile?.banner_url) && (
                  <div className="mb-3">
                    <img
                      src={bannerFile ? URL.createObjectURL(bannerFile) : profile?.banner_url}
                      alt="Banner"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <Label htmlFor="banner" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-accent">
                    <ImageIcon className="w-4 h-4" />
                    {(bannerFile || profile?.banner_url) ? 'Alterar Banner' : 'Adicionar Banner'}
                  </div>
                </Label>
                <Input
                  id="banner"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first_name">Nome</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="business_name">Nome do Negócio</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                placeholder="nome-do-seu-negocio"
              />
              {formData.business_name && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  Seu link: /bio/{formData.business_name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        </GlassCard>

        {/* Business Hours */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horários de Funcionamento
          </h2>
          
          <div className="space-y-3">
            {dayNames.map((dayName, index) => {
              const dayHour = businessHours.find(h => h.day_of_week === index);
              
              return (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium min-w-[80px]">{dayName}</span>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={dayHour?.is_working || false}
                          onChange={(e) => updateBusinessHours(index, 'is_working', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Aberto</span>
                      </label>
                    </div>
                    
                    {dayHour?.is_working && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={dayHour.start_time || '09:00'}
                          onChange={(e) => updateBusinessHours(index, 'start_time', e.target.value)}
                          className="w-24"
                        />
                        <span>às</span>
                        <Input
                          type="time"
                          value={dayHour.end_time || '18:00'}
                          onChange={(e) => updateBusinessHours(index, 'end_time', e.target.value)}
                          className="w-24"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Link Generator */}
      {formData.business_name && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Link do Cliente
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Link público para clientes</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={fullBioLinkUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(fullBioLinkUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => shareLink(fullBioLinkUrl)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Compartilhe este link com seus clientes para eles agendarem
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => copyToClipboard(fullBioLinkUrl)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => shareLink(fullBioLinkUrl)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <Label className="text-sm font-medium">QR Code</Label>
              <div className="mt-2 flex justify-center">
                <img
                  src={generateQRCode(fullBioLinkUrl)}
                  alt="QR Code do BioLink"
                  className="w-32 h-32 border rounded-lg"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Clientes podem escanear para acessar diretamente
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Preview */}
      {bioLinkUrl && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Preview do BioLink</h2>
          <div className="bg-gradient-hero rounded-lg p-4">
            <div className="max-w-md mx-auto">
              {/* Banner */}
              {(bannerFile || profile?.banner_url) && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={bannerFile ? URL.createObjectURL(bannerFile) : profile?.banner_url}
                    alt="Banner"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
              
              {/* Profile */}
              <div className="text-center mb-4">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : profile?.avatar_url} />
                  <AvatarFallback>
                    {formData.business_name ? formData.business_name[0] : formData.first_name[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-bold text-white">
                  {formData.business_name || `${formData.first_name} ${formData.last_name}`}
                </h3>
                <Badge variant="secondary" className="mt-2">
                  {bioLinkUrl}
                </Badge>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};