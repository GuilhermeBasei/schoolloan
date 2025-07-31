import { useState } from 'react'
import './Relatorios.css'
import logo from '../assets/logo.png';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

function Relatorios() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    return (
        <>
            <div className="container">
                <div className="app">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <div className="main">
                        <Sidebar isOpen={sidebarOpen} />
                        <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                            <div className="login-boxfundo">
                                <img src={logo} alt="Logo SchoolLoan" className="logo" />
                                <h2>Equipamentos Faltando</h2>
                                <form>
                              
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Relatorios;