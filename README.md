# GoAgendas - Plataforma de Gestão para Profissionais de Serviços

![GoAgendas](https://img.shields.io/badge/Status-Desenvolvimento-blue) ![React](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue) ![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## 📋 Sobre o Projeto

GoAgendas é uma plataforma completa de gestão para profissionais de serviços (salões de beleza, clínicas, consultórios, etc.). O sistema oferece agendamento online, gestão de clientes, controle financeiro, marketing e muito mais.

### 🎯 Características Principais

- **Design Moderno**: Interface glassmorphism com gradientes futuristas inspirados em Apple/Starlink
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Tempo Real**: Dashboard com métricas atualizadas instantaneamente
- **BioLink**: Página personalizada para captação de clientes
- **Multi-idioma**: Suporte a português brasileiro

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de CSS
- **Radix UI** - Componentes acessíveis
- **React Query** - Gerenciamento de estado servidor
- **React Router DOM** - Roteamento
- **Recharts** - Gráficos e visualizações
- **React Hook Form** - Formulários
- **Zod** - Validação de dados

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados
- **Row Level Security (RLS)** - Segurança de dados
- **Edge Functions** - Funções serverless
- **Realtime** - Atualizações em tempo real

### Design System
- **Glassmorphism** - Estilo visual principal
- **CSS Custom Properties** - Tokens de design
- **Tailwind Variants** - Componentes tipados
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                    # Componentes base (shadcn/ui)
│   ├── dashboard/             # Componentes do dashboard
│   ├── booking/              # Sistema de agendamento
│   └── features-section.tsx  # Seções da landing page
├── contexts/
│   └── auth-context.tsx      # Contexto de autenticação
├── pages/
│   ├── Dashboard.tsx         # Dashboard principal
│   ├── Appointments.tsx      # Gestão de agendamentos
│   ├── Clients.tsx          # Gestão de clientes
│   ├── Services.tsx         # Gestão de serviços
│   ├── Financial.tsx        # Controle financeiro
│   ├── BioLink.tsx          # Página pública do profissional
│   └── ...                  # Outras páginas
├── integrations/
│   └── supabase/            # Configuração do Supabase
├── hooks/                   # Hooks customizados
├── lib/                     # Utilitários
└── assets/                  # Imagens e recursos
```

## 🗃️ Schema do Banco de Dados

### Tabelas Principais

**profiles** - Perfis dos usuários
- `user_id` (UUID) - ID do usuário
- `business_name` (TEXT) - Nome do negócio
- `first_name`, `last_name` (TEXT) - Nome do profissional
- `email`, `phone` (TEXT) - Contatos
- Configurações de design da BioLink

**services** - Serviços oferecidos
- `name` (TEXT) - Nome do serviço
- `price` (NUMERIC) - Preço
- `duration` (INTEGER) - Duração em minutos
- `description` (TEXT) - Descrição
- `color` (TEXT) - Cor para identificação

**clients** - Clientes cadastrados
- `name` (TEXT) - Nome do cliente
- `email`, `phone` (TEXT) - Contatos
- `notes` (TEXT) - Observações

**appointments** - Agendamentos
- `client_id` (UUID) - Cliente
- `service_id` (UUID) - Serviço
- `appointment_date` (DATE) - Data
- `start_time`, `end_time` (TIME) - Horários
- `status` (TEXT) - Status do agendamento
- `payment_amount` (NUMERIC) - Valor
- `payment_status` (TEXT) - Status do pagamento

**business_hours** - Horários de funcionamento
- `day_of_week` (INTEGER) - Dia da semana (0-6)
- `start_time`, `end_time` (TIME) - Horários
- `is_working` (BOOLEAN) - Se trabalha no dia

### Funcionalidades Avançadas

- **Marketing**: Campanhas, promoções, programa de fidelidade
- **Financeiro**: Fluxo de caixa, relatórios, comissões
- **Estoque**: Produtos, movimentações, controle de estoque
- **Funcionários**: Gestão de equipe e comissões
- **Relatórios**: Analytics e métricas de negócio

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone <YOUR_GIT_URL>
cd goagendas
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
- O projeto já está configurado com as credenciais do Supabase
- Projeto ID: `uhgceuwfwslqwkytgdoi`
- URL: `https://uhgceuwfwslqwkytgdoi.supabase.co`

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse o sistema**
- Frontend: `http://localhost:5173`
- Dashboard Supabase: [Link do projeto](https://supabase.com/dashboard/project/uhgceuwfwslqwkytgdoi)

## 🔐 Autenticação e Segurança

- **Row Level Security (RLS)** configurado em todas as tabelas
- **Políticas de acesso** garantem que usuários só vejam seus próprios dados
- **Autenticação** via Supabase Auth (email/senha, OAuth)
- **Validação** no frontend e backend

## 📱 Funcionalidades Implementadas

### ✅ Dashboard
- [x] Saudação personalizada
- [x] Métricas principais (agendamentos, clientes, receita)
- [x] Gráficos de evolução (7 dias)
- [x] Próximo agendamento
- [x] Modal de agendamento rápido
- [x] Botão flutuante para novo agendamento

### ✅ Gestão de Agendamentos
- [x] Calendário visual
- [x] Formulário de agendamento
- [x] Status de agendamentos
- [x] Notificações automáticas

### ✅ Gestão de Clientes
- [x] Cadastro completo
- [x] Histórico de agendamentos
- [x] Notas e observações

### ✅ Gestão de Serviços
- [x] Cadastro de serviços
- [x] Preços e durações
- [x] Categorização por cores

### ✅ BioLink
- [x] Página pública personalizável
- [x] Agendamento online
- [x] Design customizável
- [x] Integração com redes sociais

### 🔄 Em Desenvolvimento
- [ ] Sistema de pagamentos
- [ ] Relatórios avançados
- [ ] Notificações push
- [ ] App mobile

## 🎨 Design System

### Cores Principais
```css
--primary: 222.2 84% 4.9%;           /* Azul principal */
--primary-glow: 221.2 83.2% 53.3%;  /* Azul brilhante */
--secondary: 210 40% 8%;             /* Cinza escuro */
--accent: 210 40% 98%;               /* Branco suave */
```

### Gradientes
```css
--gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
--gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
```

### Componentes
- Todos os componentes seguem o padrão **shadcn/ui**
- **Glassmorphism** aplicado nos cards principais
- **Animações** suaves com Tailwind CSS

## 🚀 Deploy

### Supabase (Automático)
- Edge Functions são deployadas automaticamente
- Migrations são aplicadas via interface

### Frontend (Lovable)
- Deploy automático via botão "Publish"
- URL: `[projeto].lovable.app`
- Domínio customizado disponível

## 📊 Métricas e Analytics

O sistema coleta automaticamente:
- Número de agendamentos por dia/mês
- Receita por período
- Taxa de conversão de leads
- Satisfação dos clientes
- Performance dos serviços

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

- **Documentação**: Este README
- **Issues**: Use o sistema de issues do repositório
- **Email**: [seu-email@dominio.com]

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ usando Lovable, React e Supabase**
