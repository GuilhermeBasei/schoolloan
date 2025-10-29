import { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function CadastroEquip() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [patrimonio, setPatrimonio] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/equipamentos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ exige token
        },
        body: JSON.stringify({ patrimonio, descricao }),
      });

      if (response.ok) {
        setMensagem('Equipamento cadastrado com sucesso!');
        setPatrimonio('');
        setDescricao('');
      } else {
        const data = await response.json();
        setMensagem(data.error || 'Erro ao cadastrar equipamento.');
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
              <h2>Cadastro de Equipamento</h2>
              <form onSubmit={handleSubmit}>
                <label>Patrimônio:</label>
                <input
                  type="number"
                  value={patrimonio}
                  onChange={(e) => setPatrimonio(e.target.value)}
                  required
                />

                <label>Descrição:</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
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

export default CadastroEquip;
