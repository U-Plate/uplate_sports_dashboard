import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext'
import { AuthGate } from './auth/AuthGate'
import { AppProvider } from './store/AppContext'
import RosterOverview from './pages/RosterOverview'
import TeamCreate from './pages/TeamCreate'
import AthleteDetail from './pages/AthleteDetail'
import Settings from './pages/Settings'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthGate>
          <AppProvider>
            <Routes>
              <Route element={<App />}>
                <Route index element={<RosterOverview />} />
                <Route path="teams/new" element={<TeamCreate />} />
                <Route path="athletes/:athleteId" element={<AthleteDetail />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </AppProvider>
        </AuthGate>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
