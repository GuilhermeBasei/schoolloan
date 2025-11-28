import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'


function RelatorioMensal() {
 const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
    const [emprestimos, setEmprestimos] = useState([])
    const [mensagem, setMensagem] = useState('')
    const [filtro, setFiltro] = useState('')

    useEffect(() => {
        async function fetchRelatorio() {
            try {
                const res = await fetch('http://localhost:3000/emprestimos/relatorio/mensal', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || 'Erro ao buscar relatório mensal.')
                }

                setEmprestimos(data)
            } catch (error) {
                setMensagem(error.message)
            }
        }

        fetchRelatorio()
    }, [])

   
    const emprestimosFiltrados = emprestimos.filter(emp => {
        const texto = filtro.toLowerCase()

        return (
            emp.usuario?.nome?.toLowerCase().includes(texto) ||
            emp.equipamento?.patrimonio?.toLowerCase().includes(texto) ||
            emp.equipamento?.descricao?.toLowerCase().includes(texto) ||
            emp.salaUtilizacao?.toLowerCase().includes(texto) ||
            emp.dataDevolucaoFormatada?.toLowerCase().includes(texto)
        )
    })

    return (
        <div className="app-container" style={{ flexDirection: 'column', height: '100vh' }}>
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar isOpen={sidebarOpen} />
                
                <main className="content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <div className="center-container" style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                        
                        <div className="glass-card wide" style={{ padding: '30px' }}>
                            <h2 style={{ marginBottom: '20px' }}>Relatório Mensal - Empréstimos Finalizados</h2>

                            {mensagem && (
                                <p style={{ color: 'var(--danger)', marginBottom: '15px' }}>{mensagem}</p>
                            )}

                            {}
                            <input
                                type="text"
                                placeholder="Buscar por nome, patrimônio, descrição, sala ou data..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                style={{ marginBottom: '20px' }}
                            />

                            <div className="tabela-container">
                                <div className="tabela-header" style={{ gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr' }}>
                                    <span>Usuário</span>
                                    <span>Patrimônio</span>
                                    <span>Descrição</span>
                                    <span>Sala Utilização</span>
                                    <span>Data Devolução</span>
                                </div>

                                {emprestimosFiltrados.length > 0 ? (
                                    emprestimosFiltrados.map((emp) => (
                                        <div 
                                            key={emp.id} 
                                            className="tabela-linha" 
                                            style={{ gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr' }}
                                        >
                                            <span style={{ fontWeight: 'bold' }}>{emp.usuario?.nome}</span>
                                            <span>{emp.equipamento?.patrimonio}</span>
                                            <span>{emp.equipamento?.descricao}</span>
                                            <span>{emp.salaUtilizacao}</span>
                                            <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                                {emp.dataDevolucaoFormatada}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '20px', color: '#666' }}>
                                        Nenhum empréstimo finalizado encontrado.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}

export default RelatorioMensal