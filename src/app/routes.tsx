import { Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { AppHomePage } from '../pages/AppHomePage'
import { CandidatePage } from '../pages/CandidatePage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { SignupPage } from '../pages/SignupPage'
import { TalentMapPage } from '../pages/TalentMapPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/app" element={<AppHomePage />} />
        <Route path="/app/candidate" element={<CandidatePage />} />
        <Route path="/app/candidate/talent-map" element={<TalentMapPage />} />
      </Route>
    </Routes>
  )
}
