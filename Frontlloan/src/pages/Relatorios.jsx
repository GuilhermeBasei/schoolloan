import { useState, useEffect } from 'react';
import './Relatorios.css';
import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

function Relatorios() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [emprestimos, setEmprestimos] = useState([]);

    async function getRelatorio() {
        try {
            const response = await api.get('/emprestimos'); // não repita a URL base
            setEmprestimos(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Erro ao buscar relatórios:', error);
        }
    }

    useEffect(() => {
        getRelatorio();
    }, []);

    return (
        <div className="container">
            <div className="app">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="main">
                    <Sidebar isOpen={sidebarOpen} />
                    <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <div className="login-boxfundo">
                            <img src={logo} alt="Logo SchoolLoan" className="logo" />
                            <h2>Equipamentos Faltando</h2>

                            <pre>{JSON.stringify(emprestimos, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Relatorios;
