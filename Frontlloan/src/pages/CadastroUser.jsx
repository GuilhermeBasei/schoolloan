import { useState, useEffect } from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function CadastroUser() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState(null); // 👈 controla se está editando

  // 🔹 Buscar lista de usuários
  const carregarUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // 🔹 Função para cadastrar ou editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      let response;

      if (editandoId) {
        // 🔸 Modo EDIÇÃO
        response = await fetch(`http://localhost:3000/usuarios/${editandoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, codigo }),
        });
      } else {
        // 🔸 Modo CADASTRO
        response = await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, codigo }),
        });
      }

      if (response.ok) {
        setMensagem(editandoId ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
        setNome('');
        setCodigo('');
        setEditandoId(null);
        carregarUsuarios();
      } else {
        const data = await response.json();
        setMensagem(data.error || 'Erro ao salvar usuário.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro na conexão com o servidor.');
    }
  };

  // 🔹 Função para excluir
  const excluirUsuario = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setMensagem('Usuário excluído com sucesso!');
        carregarUsuarios();
      } else {
        setMensagem('Erro ao excluir usuário.');
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  // 🔹 Função para editar
  const editarUsuario = (u) => {
    setNome(u.nome);
    setCodigo(u.codigo);
    setEditandoId(u.id);
    setMensagem('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔹 Filtro: só mostra se houver busca
  const usuariosFiltrados =
    busca.trim() === ''
      ? []
      : usuarios.filter((u) =>
          u.nome.toLowerCase().includes(busca.toLowerCase())
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
              <h2>Gerenciar Usuários</h2>

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

                <button type="submit">
                  {editandoId ? 'Salvar Alterações' : 'Cadastrar'}
                </button>

                {editandoId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditandoId(null);
                      setNome('');
                      setCodigo('');
                      setMensagem('');
                    }}
                    style={{
                  
                      backgroundColor: '#777',
                      color: '#000000ff',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </form>

              {mensagem && (
                <p style={{ marginTop: '10px', color: 'black' }}>{mensagem}</p>
              )}

              <div style={{ marginTop: '30px' }}>
                <h3 style={{ color: 'black' }}>Buscar Usuário</h3>
                <input
                  type="text"
                  placeholder="Digite o nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #ccc',
                    marginTop: '10px',
                  }}
                />
              </div>

              {usuariosFiltrados.length > 0 && (
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
                    <span>Nome</span>
                    <span>Código</span>
                    <span>Ações</span>
                  </div>

                  {usuariosFiltrados.map((u) => (
                    <div
                      key={u.id}
                      className="tabela-linha"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 200px',
                        alignItems: 'center',
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        borderTop: '1px solid #ccc',
                      }}
                    >
                      <span>{u.nome}</span>
                      <span>{u.codigo}</span>
                      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <button
                          onClick={() => editarUsuario(u)}
                          style={{
                            backgroundColor: '#ffa500',
                            border: 'none',
                            padding: '5px 10px',
                            color: '#fff',
                            borderRadius: 10,
                            cursor: 'pointer',
                          }}
                        >
                          Editar
                        </button>

                        <button
                          style={{
                            backgroundColor: '#ff4d4d',
                            border: 'none',
                            padding: '5px 10px',
                            color: '#fff',
                            borderRadius: '10px',
                            cursor: 'pointer',
                          }}
                          onClick={() => excluirUsuario(u.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroUser;
