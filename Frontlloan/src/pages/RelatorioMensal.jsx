import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import './Relatorios.css'

function RelatorioMensal() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [emprestimos, setEmprestimos] = useState([])
    const [mensagem, setMensagem] = useState('')

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

    return (
        <div className="container">
            <div className="app">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="main">
                    <Sidebar isOpen={sidebarOpen} />
                    <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <div className="login-boxfundo">
                            <h2>Relatório Mensal - Empréstimos Finalizados</h2>

                            {mensagem && <p className="mensagem">{mensagem}</p>}

                            <div className="tabela">
                                <div className="tabela-header">
                                    <span>Usuário</span>
                                    <span>Patrimônio</span>
                                    <span>Descrição</span>
                                    <span>Data Devolução</span>
                                </div>


                                                              

                                {emprestimos.length > 0 ? (
                                    emprestimos.map((emp) => (
                                        <div className="tabela-linha" key={emp.id}>
                                            <span>{emp.usuario?.nome}</span>
                                            <span>{emp.equipamento?.patrimonio}</span>
                                            <span>{emp.equipamento?.descricao}</span>
                                            <span> {new Date(emp.dataDevolucao).toLocaleString('pt-BR', {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="tabela-linha">
                                        <span colSpan="4">Nenhum empréstimo finalizado encontrado.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RelatorioMensal
