import { useState } from 'react'
import logo from '../assets/logo.png';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'

function Home() {
 const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
    return (
        <div className="app-container" style={{ flexDirection: 'column', height: '100vh' }}>
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar isOpen={sidebarOpen} />
                
                <main className="content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <div className="center-container">
                        
                        <div className="glass-card" style={{ padding: '60px 40px' }}>
                            <img 
                                src={logo} 
                                alt="Logo SchoolLoan" 
                                className="logo" 
                                style={{ width: '150px', marginBottom: '30px' }} 
                            />
                            
                            <h2 style={{ marginBottom: '40px' }}>Empréstimo de Equipamentos</h2>
                            
                            <div style={{ 
                                display: 'flex', 
                                gap: '20px', 
                                justifyContent: 'center', 
                                flexWrap: 'wrap' 
                            }}>
                                <Link 
                                    to="/emprestar" 
                                    className="btn-primary" 
                                    style={{ 
                                        textDecoration: 'none', 
                                        color: 'white', 
                                        minWidth: '200px',
                                        padding: '15px 25px',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Registrar Empréstimo
                                </Link>
                                
                                <Link 
                                    to="/recolher" 
                                    className="btn-primary" 
                                    style={{ 
                                        textDecoration: 'none', 
                                        color: 'white', 
                                        minWidth: '200px',
                                        padding: '15px 25px',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Registrar Devolução
                                </Link>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}

export default Home;