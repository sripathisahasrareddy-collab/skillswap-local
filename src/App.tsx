import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import SearchPage from '@/pages/SearchPage';
import ProviderProfilePage from '@/pages/ProviderProfilePage';
import OfferPage from '@/pages/OfferPage';
import BookingsPage from '@/pages/BookingsPage';
import ProfilePage from '@/pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/providers/:id" element={<ProviderProfilePage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/offer" element={<ProtectedRoute><OfferPage /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-gray-400">
          SkillSwap Local — Find trusted skills near you.
        </p>
      </div>
    </footer>
  );
}

export default App;
