
import { useState } from 'react'
import './Home.css'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'


function Relatórios() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    return (
        <div className="app">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="main">
                <Sidebar isOpen={sidebarOpen} />
                <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}></div>
            </div>
        </div>
    )
}

export default Relatórios;