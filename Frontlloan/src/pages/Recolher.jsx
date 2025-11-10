import { useEffect, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import './Emprestar.css'

function Recolher() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [patrimonio, setPatrimonio] = useState('')
  const [equipamentos, setEquipamentos] = useState([])
  const [mensagem, setMensagem] = useState('')
  const [scannerAtivo, setScannerAtivo] = useState(false)
  const [videoRef, setVideoRef] = useState(null)

  // 🔹 Carrega equipamentos do servidor
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

  // 🔹 Controle do scanner de leitura (igual ao da tela Emprestar)
  useEffect(() => {
    let codeReader = null

    if (scannerAtivo && videoRef) {
      codeReader = new BrowserMultiFormatReader()
      codeReader.decodeFromVideoDevice(null, videoRef, (result, err) => {
        if (result) {
          const codigo = result.getText()
          console.log('Código lido:', codigo)
          setPatrimonio(codigo)
          setMensagem('Código detectado com sucesso!')
          setScannerAtivo(false)
        }
      })
    }

    // Limpa o scanner ao desmontar
    return () => {
      if (codeReader) {
        try {
          codeReader.stopContinuousDecode()
        } catch {
          console.warn('Scanner já parado.')
        }
      }
    }
  }, [scannerAtivo, videoRef])

  // 🔹 Envia devolução ao servidor
  async function handleRecolher(e) {
    e.preventDefault()

    if (!patrimonio) {
      setMensagem('Digite ou escaneie o patrimônio do equipamento.')
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
    eq.patrimonio.toString().toLowerCase().includes(patrimonio.toLowerCase())
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
                {/* Campo do patrimônio */}
                <label>Patrimônio do Equipamento:</label>
                <input
                  type="text"
                  placeholder="Digite ou escaneie o código..."
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

                {/* Botão de ativar câmera */}
                <button
                  type="button"
                  className="btn-relatorio"
                  onClick={() => setScannerAtivo(!scannerAtivo)}
                  style={{ marginBottom: '10px' }}
                >
                  {scannerAtivo ? 'Fechar Câmera' : 'Ler Código do Equipamento'}
                </button>

                {/* Preview da câmera */}
                {scannerAtivo && (
                  <div style={{ marginBottom: '10px' }}>
                    <video
                      ref={setVideoRef}
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
