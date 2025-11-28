import { useState, useEffect } from 'react';

import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function CadastroUser() {
 const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  
  const [mostrarLista, setMostrarLista] = useState(false);

 
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  
 
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState(null);


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

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      let response;
      const body = JSON.stringify({ nome, codigo, email });
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      if (editandoId) {
      
        response = await fetch(`http://localhost:3000/usuarios/${editandoId}`, {
          method: 'PUT',
          headers,
          body,
        });
      } else {
       
        response = await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers,
          body,
        });
      }

      if (response.ok) {
        setMensagem(editandoId ? 'Usuário atualizado!' : 'Usuário cadastrado!');
        limparFormulario();
        carregarUsuarios();
        setMostrarLista(true); 
      } else {
        const data = await response.json();
        setMensagem(data.error || 'Erro ao salvar usuário.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro na conexão com o servidor.');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setCodigo('');
    setEmail('');
    setEditandoId(null);
    setMensagem('');
  };


  const excluirUsuario = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        carregarUsuarios();
      } else {
        setMensagem('Erro ao excluir usuário.');
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };


  const editarUsuario = (u) => {
    setNome(u.nome);
    setCodigo(u.codigo);
    setEmail(u.email);
    setEditandoId(u.id);
    setMensagem('');
    setMostrarLista(false); 
    document.querySelector('.content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const usuariosFiltrados =
    busca.trim() === ''
      ? []
      : usuarios.filter((u) =>
        u.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(busca.toLowerCase())) ||
        (u.codigo && u.codigo.includes(busca))
      );

  return (
    <div className="app-container" style={{ flexDirection: 'column', height: '100vh' }}>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar isOpen={sidebarOpen} />
        
        <main className="content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div className="center-container" style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
            
            {}
            <div className="glass-card">
              <img src={logo} alt="Logo SchoolLoan" className="logo" style={{ width: '80px', marginBottom: '10px' }} />
              <h2>{editandoId ? 'Editar Usuário' : 'Cadastrar Usuários'}</h2>

              <form onSubmit={handleSubmit}>
                <label style={{ textAlign: 'left', display: 'block' }}>Nome do Usuário:</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />

                <label style={{ textAlign: 'left', display: 'block' }}>Código do Crachá:</label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />

                <label style={{ textAlign: 'left', display: 'block' }}>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary">
                    {editandoId ? 'Salvar Alterações' : 'Cadastrar'}
                  </button>

                  {editandoId && (
                    <button
                      type="button"
                      onClick={limparFormulario}
                      style={{ background: '#666', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              {mensagem && (
                <p style={{ marginTop: '15px', color: mensagem.includes('Erro') ? 'var(--danger)' : 'red' }}>
                  {mensagem}
                </p>
              )}

              {}
              <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid rgba(255,255,255,0.2)' }} />
              
              <button 
                type="button" 
                onClick={() => setMostrarLista(!mostrarLista)}
                style={{ 
                    background: 'transparent', 
                    border: '1px solid var(--primary)', 
                    color: 'var(--text-dark)',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 'bold',
                    transition: '0.3s'
                }}
                onMouseOver={(e) => {e.target.style.background = 'var(--primary)'; e.target.style.color = 'white'}}
                onMouseOut={(e) => {e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-dark)'}}
              >
                {mostrarLista ? 'Ocultar Lista' : '🔍 Ver Lista de Usuários'}
              </button>

            </div>

            {}
            {mostrarLista && (
                <div className="glass-card wide" style={{ marginTop: '20px', padding: '20px' }}>
                <h3 style={{ color: 'var(--text-dark)', marginBottom: '10px' }}>Buscar Usuário</h3>
                <input
                    type="text"
                    placeholder="Digite nome, código ou email..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />

                {usuariosFiltrados.length > 0 ? (
                    <div className="tabela-container">
                    {}
                    <div className="tabela-header" style={{ gridTemplateColumns: '1.5fr 1fr 1.5fr 150px' }}>
                        <span>Nome</span>
                        <span>Código</span>
                        <span>Email</span>
                        <span>Ações</span>
                    </div>

                    {}
                    {usuariosFiltrados.map((u) => (
                        <div 
                            key={u.id} 
                            className="tabela-linha" 
                            style={{ gridTemplateColumns: '1.5fr 1fr 1.5fr 150px' }}
                        >
                        <span style={{ fontWeight: 'bold' }}>{u.nome}</span>
                        <span>{u.codigo}</span>
                        <span style={{ fontSize: '0.9rem', color: '#555', wordBreak: 'break-all' }}>{u.email}</span>
                        
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                            className="btn-primary"
                            onClick={() => editarUsuario(u)}
                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                            >
                            Editar
                            </button>

                            <button
                            className="btn-danger"
                            onClick={() => excluirUsuario(u.id)}
                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                            >
                            Excluir
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div style={{ padding: '20px', color: '#666' }}>
                        {busca ? 'Nenhum usuário encontrado.' : 'Digite algo para buscar.'}
                    </div>
                )}
                </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default CadastroUser;