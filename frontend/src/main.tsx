import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Routes'
import AuthProvider from './context/AuthContext'
import { NotificationProvider } from './context/notification/NotificationContext'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router}/>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
