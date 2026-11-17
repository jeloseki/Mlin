import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminPanel from './AdminPanel.jsx'

// Zaštitna komponenta koja provjerava je li admin unio točnu lozinku
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('mlin_admin_auth') === 'true';
  
  if (!isAuthenticated) {
    // Ako nije prijavljen, preusmjeri ga na ekran za unos lozinke u App.jsx
    return <Navigate to="/adminlogin" replace />;
  }
  
  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route 
          path="/admin" 
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          } 
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)