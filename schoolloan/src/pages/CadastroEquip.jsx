import { useState } from 'react'
import './Login.css'
import logo from '../assets/logo.png';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

function CadastroEquip() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    return (
        <>
            <div className="container">
                <div className="app">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <div className="main">
                        <Sidebar isOpen={sidebarOpen} />
                        <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <div className="login-box">
                            <img src={logo} alt="Logo SchoolLoan" className="logo" />
                            <h2>Cadastro de Equipamento</h2>
                            <form>
                                <label>Nome do Equipamento:</label>
                                <input type="text" />
                                <label>Patrimonio</label>
                                <input type="text" />
                                <label>Código:</label>
                                <input type="text" />
                                <button type="submit">Cadastrar</button>
                            </form>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CadastroEquip;