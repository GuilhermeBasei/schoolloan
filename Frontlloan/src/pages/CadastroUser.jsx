import { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function CadastroUser() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ protege rota com token
        },
        body: JSON.stringify({ nome, codigo }),
      });

      if (response.ok) {
        setMensagem('Usuário cadastrado com sucesso!');
        setNome('');
        setCodigo('');
      } else {
        const data = await response.json();
        setMensagem(data.error || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro na conexão com o servidor.');
    }
  };

  return (
    <div className="container">
      <div className="app">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main">
          <Sidebar isOpen={sidebarOpen} />
          <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="login-box">
              <img src={logo} alt="Logo SchoolLoan" className="logo" />
              <h2>Cadastro de Usuário</h2>
              <form onSubmit={handleSubmit}>
                <label>Nome do Usuário:</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />

                <label>Código do Crachá:</label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
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
  );
}

export default CadastroUser;
