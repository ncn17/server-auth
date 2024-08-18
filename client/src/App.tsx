import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { AuthProvider } from './context/authContext';
import Profile from './pages/Profile';
import Header from './components/header';
import PrivateRoutes from './components/privateRoutes';

/**
 * Build a custom App Wrapped
 * Init and config react router
 * @returns App
 */
export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

/**
 * Build a custom App Wrapped
 * Init and config react router
 * @returns WrappedApp
 */
export function WrappedApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}
