import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { DomainValidator } from '@/components/security/DomainValidator'
import { SecurityHeaders } from '@/components/security/SecurityHeaders'
import { RateLimiter } from '@/components/security/RateLimiter'
import { AntiClone } from '@/components/security/AntiClone'
import { setupAutoDataClearance } from '@/lib/security'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

// Configurar limpeza automática de dados sensíveis
setupAutoDataClearance()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DomainValidator>
          <AntiClone>
            <RateLimiter>
              <SecurityHeaders />
              <ThemeProvider>
                <AuthProvider>
                  <App />
                  <Toaster />
                </AuthProvider>
              </ThemeProvider>
            </RateLimiter>
          </AntiClone>
        </DomainValidator>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
