import { useEffect, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
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
  const [sala, setSala] = useState('')

  // Controle dos scanners
  const [scannerUsuarioAtivo, setScannerUsuarioAtivo] = useState(false)
  const [scannerEquipamentoAtivo, setScannerEquipamentoAtivo] = useState(false)
  const [videoUsuario, setVideoUsuario] = useState(null)
  const [videoEquipamento, setVideoEquipamento] = useState(null)

  // Busca inicial de usuários e equipamentos
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

  // Scanner do crachá do professor (usuário)
  useEffect(() => {
    let codeReader = null
    if (scannerUsuarioAtivo && videoUsuario) {
      codeReader = new BrowserMultiFormatReader()
      codeReader.decodeFromVideoDevice(null, videoUsuario, (result, err) => {
        if (result) {
          const codigo = result.getText()
          console.log('Crachá lido:', codigo)
          setUsuarioCodigo(codigo)

          const usuario = usuarios.find(u => u.codigo.toLowerCase() === codigo.toLowerCase())
          setUsuarioSelecionado(usuario || null)
          setScannerUsuarioAtivo(false)
        }
      })
    }

    return () => {
      if (codeReader) {
        try {
          codeReader.stopContinuousDecode()
        } catch (e) {
          console.warn('Scanner do usuário já parado.')
        }
      }
    }
  }, [scannerUsuarioAtivo, videoUsuario, usuarios])

  // Scanner do equipamento
  useEffect(() => {
    let codeReader = null
    if (scannerEquipamentoAtivo && videoEquipamento) {
      codeReader = new BrowserMultiFormatReader()
      codeReader.decodeFromVideoDevice(null, videoEquipamento, (result, err) => {
        if (result) {
          const codigo = result.getText()
          console.log('Equipamento lido:', codigo)
          setEquipamentoCodigo(codigo)
          const equipamento = equipamentos.find(eq => eq.patrimonio.toLowerCase() === codigo.toLowerCase())
          setEquipamentoSelecionado(equipamento || null)
          setScannerEquipamentoAtivo(false)
        }
      })
    }

    return () => {
      if (codeReader) {
        try {
          codeReader.stopContinuousDecode()
        } catch (e) {
          console.warn('Scanner do equipamento já parado.')
        }
      }
    }
  }, [scannerEquipamentoAtivo, videoEquipamento, equipamentos])

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
console.log('Sala digitada:', sala)
    try {
      const res = await fetch('http://localhost:3000/emprestimos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          usuarioId: usuarioSelecionado.id,
          equipamentoId: equipamentoSelecionado.id,
          salaUtilizacao: sala
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setMensagem(data.error || 'Erro ao criar empréstimo.')
      } else {
        setMensagem('✅ Empréstimo realizado com sucesso!')
        setUsuarioCodigo('')
        setEquipamentoCodigo('')
        setSala('')
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
                <label>Sala de Utilização:</label>
                <input
                  type="text"
                  value={sala}
                  onChange={(e) => setSala(e.target.value)}
                  placeholder="Digite a sala de utilização"
                />
                {/* Campo do usuário (professor) */}

                <label>Código do Professor:</label>
                <input
                  type="text"
                  value={usuarioCodigo}
                  onChange={handleUsuarioChange}
                  placeholder="Digite ou escaneie o crachá..."
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
                {/* Botão para ler o crachá */}
                <button
                  type="button"
                  className="btn-relatorio"
                  onClick={() => {
                    setScannerUsuarioAtivo(!scannerUsuarioAtivo)
                    setScannerEquipamentoAtivo(false)
                  }}
                  style={{ marginBottom: '10px' }}
                >
                  {scannerUsuarioAtivo ? 'Fechar Câmera do Crachá' : 'Ler Crachá do Professor'}
                </button>


                {/* Preview da câmera do crachá */}
                {scannerUsuarioAtivo && (
                  <div style={{ marginBottom: '10px' }}>
                    <video
                      ref={setVideoUsuario}
                      style={{
                        width: '100%',
                        maxWidth: 400,
                        borderRadius: 10,
                        border: '2px solid #444'
                      }}
                    />
                    <p style={{ color: '#333' }}>Aponte o crachá para a câmera...</p>
                  </div>
                )}

                {/* Campo do equipamento */}
                <label>Patrimônio do Equipamento:</label>
                <input
                  type="text"
                  value={equipamentoCodigo}
                  onChange={handleEquipamentoChange}
                  placeholder="Digite ou escaneie o código..."
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

                {/* Botão para ler código do equipamento */}
                <button
                  type="button"
                  className="btn-relatorio"
                  onClick={() => {
                    setScannerEquipamentoAtivo(!scannerEquipamentoAtivo)
                    setScannerUsuarioAtivo(false)
                  }}
                  style={{ marginBottom: '10px' }}
                >
                  {scannerEquipamentoAtivo ? 'Fechar Câmera do Equipamento' : 'Ler Código do Equipamento'}
                </button>

                {/* Preview da câmera do equipamento */}
                {scannerEquipamentoAtivo && (
                  <div style={{ marginBottom: '10px' }}>
                    <video
                      ref={setVideoEquipamento}
                      style={{
                        width: '100%',
                        maxWidth: 400,
                        borderRadius: 10,
                        border: '2px solid #444'
                      }}
                    />
                    <p style={{ color: '#333' }}>Aponte o código do equipamento para a câmera...</p>
                  </div>
                )}

                {/* Botão principal */}
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
