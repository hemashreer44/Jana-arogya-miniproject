import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from './lib/querry-client.js';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/pagenotfound.jsx';
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { LanguageProvider } from '@/lib/LanguageContext';
import UserNotRegisteredError from '@/components/usernotregisterederror';
import ProtectedRoute from './components/www.jsx';

// Layout
import AppLayout from '@/components/layout/AppLayout';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Pages
import Home from '@/pages/Home';
import Hospitals from '@/pages/Hospitals';
import Doctors from '@/pages/Doctors';
import Appointments from '@/pages/Appointments';
import Emergency from '@/pages/Emergency';
import Medicines from '@/pages/Medicines';
import Announcements from '@/pages/Announcements';
import Dashboard from '@/pages/Dashboard';
import Telemedicine from '@/pages/Telemedicine';
import Reviews from '@/pages/Reviews';
import Help from '@/pages/Help';
import Admin from '@/pages/Admin';
import LogoutAction from '@/pages/LogoutAction';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
          <span className="text-white font-bold text-2xl">+</span>
        </div>
        <p className="text-blue-800 font-semibold text-lg mb-4">Jana Arogya</p>
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/logout-action" element={<LogoutAction />} />

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/help" element={<Help />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App