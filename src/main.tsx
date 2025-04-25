import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MunicipalitiesPage from './MunicipalitiesPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div >
    <MunicipalitiesPage />
    </div>
  </StrictMode>,
)
