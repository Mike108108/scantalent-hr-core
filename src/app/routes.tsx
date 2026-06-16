import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthGuard } from '../components/auth/AuthGuard'
import { AppShell } from '../components/layout/AppShell'
import { CandidateWorkspaceProvider } from '../components/candidate/CandidateWorkspaceContext'
import { CandidateWorkspaceLayout } from '../components/candidate/CandidateWorkspaceLayout'
import { OverviewTab } from '../components/candidate/tabs/OverviewTab'
import { TalentMapTab } from '../components/candidate/tabs/TalentMapTab'
import { TechnicalMapTab } from '../components/candidate/tabs/TechnicalMapTab'
import { FoundationsTab } from '../components/candidate/tabs/FoundationsTab'
import { CandidatesPage } from '../pages/CandidatesPage'
import { ComparisonPage } from '../pages/ComparisonPage'
import { HelpPage } from '../pages/HelpPage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SignupPage } from '../pages/SignupPage'
import { VacanciesPage } from '../pages/VacanciesPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/app" element={<Navigate to="/app/candidates" replace />} />
          <Route path="/app/candidates" element={<CandidatesPage />} />
          <Route
            path="/app/candidate"
            element={
              <CandidateWorkspaceProvider>
                <CandidateWorkspaceLayout />
              </CandidateWorkspaceProvider>
            }
          >
            <Route index element={<OverviewTab />} />
            <Route path="talent-map" element={<TalentMapTab />} />
            <Route path="technical-map" element={<TechnicalMapTab />} />
            <Route path="foundations" element={<FoundationsTab />} />
          </Route>
          <Route path="/app/vacancies" element={<VacanciesPage />} />
          <Route path="/app/comparison" element={<ComparisonPage />} />
          <Route path="/app/settings" element={<SettingsPage />} />
          <Route path="/app/help" element={<HelpPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
