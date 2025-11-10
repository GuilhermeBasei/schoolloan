import { useEffect, useState } from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function CadastroADM() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [admins, setAdmins] = useState([]);
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState('');

  
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/operadores', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setAdmins(data);
      } catch (error) {
        console.error('Erro ao carregar operadores:', error);
      }
    };
    fetchAdmins();
  }, []);

  // 🔹 Envia cadastro ou atualização
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = editando ? 'PUT' : 'POST';
      const url = editando
        ? `http://localhost:3000/operadores/${editando}`
        : 'http://localhost:3000/operadores';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, senha, isAdmin: true }),
      });

      if (response.ok) {
        setMensagem(editando ? 'Operador atualizado com sucesso!' : 'Operador cadastrado com sucesso!');
        setNome('');
        setSenha('');
        setConfirmarSenha('');
        setEditando(null);

        const novos = await fetch('http://localhost:3000/operadores', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await novos.json();
        setAdmins(data);
      } else {
        const data = await response.json();
        setMensagem(data.error || 'Erro ao salvar operador.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro na conexão com o servidor.');
    }
  };

  // 🔹 Editar admin
  const handleEdit = (admin) => {
    setNome(admin.nome);
    setSenha('');
    setConfirmarSenha('');
    setEditando(admin.id);
  };

  // 🔹 Excluir admin
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este operador?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/operadores/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setAdmins(admins.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Erro ao excluir operador:', error);
    }
  };

  // 🔹 Filtro por nome
  const adminsFiltrados = admins.filter((a) =>
    a.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <div className="app">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main">
          <Sidebar isOpen={sidebarOpen} />
          <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="login-box">
              <img src={logo} alt="Logo SchoolLoan" className="logo" />
              <h2>Gerenciar Operadores</h2>

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

                <button type="submit">
                  {editando ? 'Atualizar' : 'Cadastrar'}
                </button>
              </form>

              {mensagem && (
                <p style={{ marginTop: '10px', color: 'black' }}>{mensagem}</p>
              )}

              <hr style={{ margin: '20px 0' }} />

              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              />

              {adminsFiltrados.map((admin) => (

                <div
                  className="tabela"
                  style={{
                    marginTop: '20px',
                    border: '1px solid #3f3939',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="tabela-header"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 200px',
                      backgroundColor: '#3f3939',
                      color: '#fff',
                      fontWeight: 'bold',
                      padding: '10px',
                    }}
                  >
                    <span>Patrimônio</span>
                    <span>Descrição</span>
                    <span>Ações</span>
                  </div>


                  <div key={admin.id} className="usuario-item"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 200px',
                      alignItems: 'center',
                      padding: '10px',
                      backgroundColor: '#f5f5f5',
                      borderTop: '1px solid #ccc',
                    }}>


                    <span style={{ color: 'black', marginRight: '30px' }}>{admin.nome}</span>
                    <button onClick={() => handleEdit(admin)}>Editar</button>
                    <button
                      style={{ backgroundColor: '#c0392b', marginLeft: '5px' }}
                      onClick={() => handleDelete(admin.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}

              {adminsFiltrados.length === 0 && <p>Nenhum operador encontrado.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroADM;
