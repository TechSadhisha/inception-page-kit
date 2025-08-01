
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/hooks/useAuth'
import Layout from '@/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Auth from '@/pages/Auth'
import Index from '@/pages/Index'
import Projects from '@/pages/Projects'
import Prospects from '@/pages/Prospects'
import Tasks from '@/pages/Tasks'
import TeamMessages from '@/pages/TeamMessages'
import Reports from '@/pages/Reports'
import ScriptManagement from '@/pages/ScriptManagement'
import FileManagement from '@/pages/FileManagement'
import KnowledgeBase from '@/pages/KnowledgeBase'
import Admin from '@/pages/Admin'
import ProjectSheets from '@/pages/ProjectSheets'
import Emails from '@/pages/Emails'
import Campaigns from '@/pages/Campaigns'
import NotFound from '@/pages/NotFound'
import WhatsApp from '@/pages/WhatsApp'
import PropertyListings from '@/pages/PropertyListings'
import WorkflowAutomation from '@/pages/WorkflowAutomation'
import Integrations from '@/pages/Integrations'
import LeadCentre from '@/pages/LeadCentre'
import UserManual from '@/pages/UserManual'
import TermsAndConditions from '@/pages/TermsAndConditions'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import DataDeletion from '@/pages/DataDeletion'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="projects/:projectId/sheets" element={<ProtectedRoute><ProjectSheets /></ProtectedRoute>} />
              <Route path="projects/:projectId/lead-centre" element={<ProtectedRoute><LeadCentre /></ProtectedRoute>} />
              <Route path="prospects" element={<ProtectedRoute><Prospects /></ProtectedRoute>} />
              <Route path="tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="messages" element={<ProtectedRoute><TeamMessages /></ProtectedRoute>} />
              <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="scripts" element={<ProtectedRoute><ScriptManagement /></ProtectedRoute>} />
              <Route path="files" element={<ProtectedRoute><FileManagement /></ProtectedRoute>} />
              <Route path="knowledge" element={<ProtectedRoute><KnowledgeBase /></ProtectedRoute>} />
              <Route path="emails" element={<ProtectedRoute><Emails /></ProtectedRoute>} />
              <Route path="whatsapp" element={<ProtectedRoute><WhatsApp /></ProtectedRoute>} />
              <Route path="campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
              <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="properties" element={<ProtectedRoute><PropertyListings /></ProtectedRoute>} />
              <Route path="workflows" element={<ProtectedRoute><WorkflowAutomation /></ProtectedRoute>} />
              <Route path="integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
              <Route path="manual" element={<ProtectedRoute><UserManual /></ProtectedRoute>} />
            </Route>
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/data-deletion" element={<DataDeletion />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
