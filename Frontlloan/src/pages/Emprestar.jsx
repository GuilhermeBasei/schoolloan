import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import './Emprestar.css'

function Emprestar() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [usuarioCodigo, setUsuarioCodigo] = useState('')
  const [equipamentoCodigo, setEquipamentoCodigo] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [equipamentos, setEquipamentos] = useState([])
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null)
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [usuariosRes, equipamentosRes] = await Promise.all([
          fetch('http://localhost:3000/usuarios', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch('http://localhost:3000/equipamentos', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ])
        const usuariosData = await usuariosRes.json()
        const equipamentosData = await equipamentosRes.json()
        setUsuarios(usuariosData)
        setEquipamentos(equipamentosData)
      } catch (error) {
        setMensagem('Erro ao carregar dados.')
      }
    }
    fetchData()
  }, [])

  function handleUsuarioChange(e) {
    const value = e.target.value
    setUsuarioCodigo(value)
    const usuario = usuarios.find(u => u.codigo.toLowerCase() === value.toLowerCase())
    setUsuarioSelecionado(usuario || null)
  }

  function handleEquipamentoChange(e) {
    const value = e.target.value
    setEquipamentoCodigo(value)
    const equipamento = equipamentos.find(eq => eq.patrimonio.toLowerCase() === value.toLowerCase())
    setEquipamentoSelecionado(equipamento || null)
  }

  async function handleEmprestar(e) {
    e.preventDefault()
    if (!usuarioSelecionado || !equipamentoSelecionado) {
      setMensagem('Informe códigos válidos para usuário e equipamento.')
      return
    }

    try {
      const res = await fetch('http://localhost:3000/emprestimos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          usuarioId: usuarioSelecionado.id,
          equipamentoId: equipamentoSelecionado.id
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setMensagem(data.error || 'Erro ao criar empréstimo.')
      } else {
        setMensagem('✅ Empréstimo realizado com sucesso!')
        setUsuarioCodigo('')
        setEquipamentoCodigo('')
        setUsuarioSelecionado(null)
        setEquipamentoSelecionado(null)
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.')
    }
  }

  const usuariosFiltrados = usuarios.filter(u =>
    u.codigo.toLowerCase().includes(usuarioCodigo.toLowerCase())
  )

  const equipamentosFiltrados = equipamentos.filter(eq =>
    eq.patrimonio.toLowerCase().includes(equipamentoCodigo.toLowerCase()) && eq.disponivel
  )

  return (
    <div className="container">
      <div className="app">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main">
          <Sidebar isOpen={sidebarOpen} />
          <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="card-emprestimo">
              <h2>Realizar Empréstimo</h2>
              <form onSubmit={handleEmprestar}>
                <label>Código do Usuário:</label>
                <input
                  type="text"
                  value={usuarioCodigo}
                  onChange={handleUsuarioChange}
                  placeholder="Digite o código do crachá..."
                  list="listaUsuarios"
                  autoComplete="off"
                />
                <datalist id="listaUsuarios">
                  {usuariosFiltrados.map(u => (
                    <option key={u.id} value={u.codigo}>
                      {u.nome}
                    </option>
                  ))}
                </datalist>

                <label>Patrimônio do Equipamento:</label>
                <input
                  type="text"
                  value={equipamentoCodigo}
                  onChange={handleEquipamentoChange}
                  placeholder="Digite o código do equipamento..."
                  list="listaEquipamentos"
                  autoComplete="off"
                />
                <datalist id="listaEquipamentos">
                  {equipamentosFiltrados.map(eq => (
                    <option key={eq.id} value={eq.patrimonio}>
                      {eq.descricao}
                    </option>
                  ))}
                </datalist>

                <button className="btn-relatorio" type="submit">
                  Emprestar
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

export default Emprestar
