import { useState } from 'react'
import './Home.css'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'

function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    return (
        <div className="app">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="main">
                <Sidebar isOpen={sidebarOpen} />
                <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                    <button className="main-button"><Link to="/Emprestar">Emprestar Equipamento</Link></button>
                    <button className="main-button"><Link to="/Recolher">Recolher Equipamento</Link></button>
                     <button className="main-button"><Link to="/Relatorios">Relatórios</Link></button>
                    <button className="main-button"><Link to="/Cadastro">Realizar Cadastros</Link></button>
                     
                </div>
            </div>
        </div>
    )
}

export default Home;

