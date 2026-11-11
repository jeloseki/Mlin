import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Lazy-load the Admin panel — doesn't bloat the initial bundle
const AdminPanel = lazy(() => import('./AdminPanel.jsx'))

const AdminLoadingFallback = () => (
  <div style={{ minHeight: '100vh', background: '#0f172a' }} />
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminPanel />
          </Suspense>
        } />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)