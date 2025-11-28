import { useEffect, useState, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'


function Emprestar() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)

  const [usuarioCodigo, setUsuarioCodigo] = useState('')
  const [equipamentoCodigo, setEquipamentoCodigo] = useState('')
  const [sala, setSala] = useState('')


  const [usuarios, setUsuarios] = useState([])
  const [equipamentos, setEquipamentos] = useState([])
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null)
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null)
  const [mensagem, setMensagem] = useState('')


  const [scannerUsuarioAtivo, setScannerUsuarioAtivo] = useState(false)
  const [scannerEquipamentoAtivo, setScannerEquipamentoAtivo] = useState(false)
  const [videoUsuario, setVideoUsuario] = useState(null)
  const [videoEquipamento, setVideoEquipamento] = useState(null)

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
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const [usuariosRes, equipamentosRes] = await Promise.all([
          fetch('http://localhost:3000/usuarios', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/equipamentos', {
            headers: { Authorization: `Bearer ${token}` }
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

  
  useEffect(() => {
    if (usuarioCodigo && usuarios.length > 0) {
      const usuario = usuarios.find(u => u.codigo.toLowerCase() === usuarioCodigo.toLowerCase())
      setUsuarioSelecionado(usuario || null)
    } else {
      setUsuarioSelecionado(null)
    }
  }, [usuarioCodigo, usuarios])

  
  useEffect(() => {
    if (equipamentoCodigo && equipamentos.length > 0) {
      const equipamento = equipamentos.find(eq => eq.patrimonio.toString().toLowerCase() === equipamentoCodigo.toLowerCase())
      setEquipamentoSelecionado(equipamento || null)
    } else {
      setEquipamentoSelecionado(null)
    }
  }, [equipamentoCodigo, equipamentos])

  
  useEffect(() => {
    if (scannerUsuarioAtivo && videoUsuario && codeReader.current) {
     
      codeReader.current.decodeFromVideoDevice(undefined, videoUsuario, (result, err) => {
        if (result) {
          const codigo = result.getText()
          console.log('Crachá lido:', codigo)

          stopScanning(); 
          setUsuarioCodigo(codigo)
          setScannerUsuarioAtivo(false)
        }
      })
        .then((controls) => {
          controlsRef.current = controls; 
        })
        .catch((err) => console.error(err))
    } else {
      stopScanning();
    }
  }, [scannerUsuarioAtivo, videoUsuario])

  
  useEffect(() => {
    if (scannerEquipamentoAtivo && videoEquipamento && codeReader.current) {
      codeReader.current.decodeFromVideoDevice(undefined, videoEquipamento, (result, err) => {
        if (result) {
          const codigo = result.getText()
          console.log('Equipamento lido:', codigo)

          stopScanning(); 
          setEquipamentoCodigo(codigo)
          setScannerEquipamentoAtivo(false)
        }
      })
        .then((controls) => {
          controlsRef.current = controls; 
        })
        .catch((err) => console.error(err))
    } else {
      stopScanning(); 
    }
  }, [scannerEquipamentoAtivo, videoEquipamento])


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
        
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.')
    }
  }

 
  const usuariosFiltrados = usuarios.filter(u =>
    u.codigo.toLowerCase().includes(usuarioCodigo.toLowerCase())
  )

  const equipamentosFiltrados = equipamentos.filter(eq =>
    eq.patrimonio.toString().toLowerCase().includes(equipamentoCodigo.toLowerCase()) && eq.disponivel
  )

  return (
    <div className="app-container" style={{ flexDirection: 'column', height: '100vh' }}>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar isOpen={sidebarOpen} />

        <main className="content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div className="center-container">

            <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
              <h2>Realizar Empréstimo</h2>

              <form onSubmit={handleEmprestar}>

                {}
                <label style={{ textAlign: 'left', display: 'block' }}>Sala de Utilização:</label>
                <input
                  type="text"
                  value={sala}
                  onChange={(e) => setSala(e.target.value)}
                  placeholder="Ex: Lab 3, Sala 101..."
                />

                {}
                <label style={{ textAlign: 'left', display: 'block' }}>Código do Professor:</label>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <input
                    type="text"
                    value={usuarioCodigo}
                    onChange={(e) => setUsuarioCodigo(e.target.value)}
                    placeholder="Digite ou escaneie o crachá..."
                    list="listaUsuarios"
                    autoComplete="off"
                    style={{ marginBottom: '5px' }}
                  />
                  <datalist id="listaUsuarios">
                    {usuariosFiltrados.map(u => (
                      <option key={u.id} value={u.codigo}>{u.nome}</option>
                    ))}
                  </datalist>

                  <button
                    type="button"
                    className="btn-primary" 
                    onClick={() => {
                     
                      if (!scannerUsuarioAtivo) {
                        setScannerEquipamentoAtivo(false);
                        stopScanning();
                      }
                      setScannerUsuarioAtivo(!scannerUsuarioAtivo)
                    }}
                    style={{
                      background: scannerUsuarioAtivo ? 'var(--danger)' : '#666',
                      fontSize: '0.9rem',
                      marginBottom: '15px'
                    }}
                  >
                    {scannerUsuarioAtivo ? 'Fechar Câmera' : '📷 Ler Crachá'}
                  </button>
                </div>

                {}
                {scannerUsuarioAtivo && (
                  <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #444' }}>
                    <video
                      ref={setVideoUsuario}
                      style={{ width: '100%', display: 'block' }}
                    />
                    <p style={{ background: '#222', color: '#fff', padding: '5px', margin: 0, fontSize: '0.8rem' }}>
                      Aponte o crachá...
                    </p>
                  </div>
                )}


                {}
                <label style={{ textAlign: 'left', display: 'block' }}>Patrimônio do Equipamento:</label>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <input
                    type="text"
                    value={equipamentoCodigo}
                    onChange={(e) => setEquipamentoCodigo(e.target.value)}
                    placeholder="Digite ou escaneie o código..."
                    list="listaEquipamentos"
                    autoComplete="off"
                    style={{ marginBottom: '5px' }}
                  />
                  <datalist id="listaEquipamentos">
                    {equipamentosFiltrados.map(eq => (
                      <option key={eq.id} value={eq.patrimonio}>{eq.descricao}</option>
                    ))}
                  </datalist>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      if (!scannerEquipamentoAtivo) {
                        setScannerUsuarioAtivo(false);
                        stopScanning();
                      }
                      setScannerEquipamentoAtivo(!scannerEquipamentoAtivo)
                    }}
                    style={{
                      background: scannerEquipamentoAtivo ? 'var(--danger)' : '#666',
                      fontSize: '0.9rem',
                      marginBottom: '15px'
                    }}
                  >
                    {scannerEquipamentoAtivo ? 'Fechar Câmera' : '📷 Ler Equipamento'}
                  </button>
                </div>

                {}
                {scannerEquipamentoAtivo && (
                  <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #444' }}>
                    <video
                      ref={setVideoEquipamento}
                      style={{ width: '100%', display: 'block' }}
                    />
                    <p style={{ background: '#222', color: '#fff', padding: '5px', margin: 0, fontSize: '0.8rem' }}>
                      Aponte o código...
                    </p>
                  </div>
                )}

                {}
                <button
                  className="btn-primary"
                  type="submit"
                  style={{ width: '100%', marginTop: '10px', padding: '15px', fontSize: '1.1rem' }}
                >
                  Confirmar Empréstimo
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

export default Emprestar