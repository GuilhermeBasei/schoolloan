import { useState } from 'react'
import './Home.css'
import logo from '../assets/logo.png';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'

function Home() {
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
                                <h2>Empréstimo de Equipamentos</h2>
                                <div className='login-boxa'>
                                    <button type="button" className="btn-relatorio"><Link to="/emprestar">Registrar Empréstimo</Link></button>
                                    <button type="button" className="btn-relatorio"><Link to="/recolher">Registrar Devolução</Link></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;