import { useState } from 'react'
import './Login.css'
import logo from '../assets/logo.png';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

function CadastroADM() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [nome, setNome] = useState('')

  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [isAdmin, setIsAdmin] = useState(true)
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.')
      return
    }

    try {
     
      const response = await fetch('http://localhost:3000/operadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha, isAdmin })
      })

      if (response.ok) {
        setMensagem('Operador cadastrado com sucesso!')
        setNome('')
        setSenha('')
        setConfirmarSenha('')
      } else {
        const data = await response.json()
        setMensagem(data.error || 'Erro ao cadastrar operador.')
      }
    } catch (error) {
      console.error(error)
      setMensagem('Erro na conexão com o servidor.')
    }
  }

  return (
    <div className="container">
      <div className="app">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main">
          <Sidebar isOpen={sidebarOpen} />
          <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="login-box">
              <img src={logo} alt="Logo SchoolLoan" className="logo" />
              <h2>Cadastro de Admin</h2>
              <form onSubmit={handleSubmit}>
                <label>Usuário:</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />

                

                <label>Senha:</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />

                <label>Confirmar Senha:</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />

                <button type="submit">Cadastrar</button>
              </form>

              {mensagem && <p style={{ marginTop: '10px', color: 'white' }}>{mensagem}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CadastroADM
