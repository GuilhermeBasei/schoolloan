import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import '../src/components/pages.css'
import '../src/components/layout.css'
import MainRoutes from './routes.tsx'

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <MainRoutes />
  </BrowserRouter>
)


