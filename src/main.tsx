import React from 'react'
import ReactDOM from 'react-dom/client'
import { SecurityHeaders } from '@/components/security/SecurityHeaders'
import { RateLimiter } from '@/components/security/RateLimiter'
import { AntiClone } from '@/components/security/AntiClone'
import { setupAutoDataClearance } from '@/lib/security'
import App from './App.tsx'
import './index.css'

// Configurar limpeza automática de dados sensíveis
setupAutoDataClearance()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AntiClone>
      <RateLimiter>
        <SecurityHeaders />
        <App />
      </RateLimiter>
    </AntiClone>
  </React.StrictMode>,
)
