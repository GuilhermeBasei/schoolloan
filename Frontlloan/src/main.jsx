import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import MainRoutes from './Routes'

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <MainRoutes />
  </BrowserRouter>
)


