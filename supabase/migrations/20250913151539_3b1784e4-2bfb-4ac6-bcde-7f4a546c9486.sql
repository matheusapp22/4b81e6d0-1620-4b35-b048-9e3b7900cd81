-- Criar política para permitir acesso público aos perfis para bio links
-- Isso é necessário para que a view public_profiles funcione corretamente
CREATE POLICY "Public access to profile data for bio links" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Remover a política mais restritiva de visualização
DROP POLICY "Users can view their own profile" ON public.profiles;

-- Manter as políticas de INSERT e UPDATE apenas para o proprietário
-- (estas já existem e estão corretas)

-- Adicionar comentário explicando o modelo de segurança
COMMENT ON TABLE public.profiles IS 'User profiles - publicly readable for bio links, editable only by owners';