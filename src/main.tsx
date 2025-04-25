import { createTheme, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MunicipalitiesPage from './MunicipalitiesPage.tsx';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>    
      <MunicipalitiesPage />
    </ThemeProvider>
  </StrictMode>,
)
