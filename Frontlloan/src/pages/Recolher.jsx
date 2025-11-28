import { useEffect, useState, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'


function Recolher() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [patrimonio, setPatrimonio] = useState('')
  const [equipamentos, setEquipamentos] = useState([])
  const [mensagem, setMensagem] = useState('')
  const [scannerAtivo, setScannerAtivo] = useState(false)
  const [videoRef, setVideoRef] = useState(null)

  const codeReader = useRef(null);
  const controlsRef = useRef(null);


  useEffect(() => {
    try {
      codeReader.current = new BrowserMultiFormatReader();
    } catch (error) {
      console.error("Erro ao inicializar leitor de código:", error);
    }
  }, []);


  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
  };


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


  useEffect(() => {
    if (scannerAtivo && videoRef && codeReader.current) {

      codeReader.current.decodeFromVideoDevice(undefined, videoRef, (result, err) => {
        if (result) {
          const codigo = result.getText()
          console.log('Código lido:', codigo)

          stopScanning(); 
          setPatrimonio(codigo)
          setMensagem('Código detectado com sucesso!')
          setScannerAtivo(false)
        }
      })
        .then((controls) => {
          controlsRef.current = controls; 
        })
        .catch((err) => console.error(err))
    } else {
      stopScanning(); 
    }
  }, [scannerAtivo, videoRef])

  // 🔹
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
      
        setEquipamentos(prev => prev.map(e =>
          e.patrimonio.toString() === patrimonio.toString() ? { ...e, disponivel: true } : e
        ))
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.')
    }
  }

  const equipamentosFiltrados = equipamentosComEmprestimo.filter(eq =>
    eq.patrimonio.toString().toLowerCase().includes(patrimonio.toLowerCase())
  )

  return (
    <div className="app-container" style={{ flexDirection: 'column', height: '100vh' }}>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar isOpen={sidebarOpen} />

        <main className="content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div className="center-container">

            <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
              <h2>Registrar Devolução</h2>

              <form onSubmit={handleRecolher}>

                {}
                <label style={{ textAlign: 'left', display: 'block' }}>Patrimônio do Equipamento:</label>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <input
                    type="text"
                    placeholder="Digite ou escaneie o código..."
                    value={patrimonio}
                    onChange={(e) => setPatrimonio(e.target.value)}
                    list="listaDevolucao"
                    autoComplete="off"
                    style={{ marginBottom: '5px' }}
                  />
                  <datalist id="listaDevolucao">
                    {equipamentosFiltrados.map(eq => (
                      <option key={eq.id} value={eq.patrimonio}>
                        {eq.descricao}
                      </option>
                    ))}
                  </datalist>

                  {}
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      if (scannerAtivo) stopScanning(); 
                      setScannerAtivo(!scannerAtivo)
                    }}
                    style={{
                      background: scannerAtivo ? 'var(--danger)' : '#666',
                      fontSize: '0.9rem',
                      marginBottom: '15px'
                    }}
                  >
                    {scannerAtivo ? 'Fechar Câmera' : '📷 Ler Código'}
                  </button>
                </div>

                {}
                {scannerAtivo && (
                  <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #444' }}>
                    <video
                      ref={setVideoRef}
                      style={{ width: '100%', display: 'block' }}
                    />
                    <p style={{ background: '#222', color: '#fff', padding: '5px', margin: 0, fontSize: '0.8rem' }}>
                      Aponte o código do equipamento...
                    </p>
                  </div>
                )}

                <button
                  className="btn-primary"
                  type="submit"
                  style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}
                >
                  Confirmar Devolução
                </button>
              </form>

              {mensagem && (
                <p style={{
                  marginTop: '20px',
                  fontWeight: 'bold',
                  color: mensagem.includes('Erro') ? 'var(--danger)' : 'var(green)'
                }}>
                  {mensagem}
                </p>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default Recolher