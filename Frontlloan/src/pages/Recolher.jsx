import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import './Emprestar.css' // reaproveita o mesmo estilo

function Recolher() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [patrimonio, setPatrimonio] = useState('')
  const [equipamentos, setEquipamentos] = useState([])
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    async function fetchEquipamentos() {
      try {
        const res = await fetch('http://localhost:3000/equipamentos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        const data = await res.json()
        setEquipamentos(data)
      } catch (error) {
        setMensagem('Erro ao carregar equipamentos.')
      }
    }
    fetchEquipamentos()
  }, [])

  const equipamentosComEmprestimo = equipamentos.filter(e => !e.disponivel)

  async function handleRecolher(e) {
    e.preventDefault()

    if (!patrimonio) {
      setMensagem('Digite o patrimônio do equipamento.')
      return
    }

    try {
      const res = await fetch('http://localhost:3000/emprestimos/devolver', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ patrimonio }),
      })

      const data = await res.json()
      if (!res.ok) {
        setMensagem(data.error || 'Erro ao registrar devolução.')
      } else {
        setMensagem('✅ Devolução registrada com sucesso!')
        setPatrimonio('')
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.')
    }
  }

  const equipamentosFiltrados = equipamentosComEmprestimo.filter(eq =>
    eq.patrimonio.toLowerCase().includes(patrimonio.toLowerCase())
  )

  return (
    <div className="container">
      <div className="app">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main">
          <Sidebar isOpen={sidebarOpen} />
          <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="card-emprestimo">
              <h2>Registrar Devolução</h2>

              <form onSubmit={handleRecolher}>
                <label>Patrimônio do Equipamento:</label>
                <input
                  type="text"
                  placeholder="Digite o código do equipamento..."
                  value={patrimonio}
                  onChange={(e) => setPatrimonio(e.target.value)}
                  list="listaDevolucao"
                  autoComplete="off"
                />
                <datalist id="listaDevolucao">
                  {equipamentosFiltrados.map(eq => (
                    <option key={eq.id} value={eq.patrimonio}>
                      {eq.descricao}
                    </option>
                  ))}
                </datalist>

                <button className="btn-relatorio" type="submit">
                  Devolver
                </button>
              </form>

              {mensagem && <p className="mensagem">{mensagem}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recolher
