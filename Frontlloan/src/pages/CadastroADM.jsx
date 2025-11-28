import { useEffect, useState } from 'react';

import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function CadastroADM() {
   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  

  const [mostrarLista, setMostrarLista] = useState(false);


  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [admins, setAdmins] = useState([]);
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

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
        setMensagem(editando ? 'Operador atualizado!' : 'Operador cadastrado!');
        setNome('');
        setSenha('');
        setConfirmarSenha('');
        setEditando(null);
        fetchAdmins(); 
        setMostrarLista(true); 
      } else {
        const data = await response.json();
        setMensagem(data.error || 'Erro ao salvar operador.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro na conexão com o servidor.');
    }
  };

 
  const handleEdit = (admin) => {
    setNome(admin.nome);
    setSenha('');
    setConfirmarSenha('');
    setEditando(admin.id);
    setMostrarLista(false); 
    document.querySelector('.content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };


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


  const adminsFiltrados = admins.filter((a) =>
    a.nome.toLowerCase().includes(filtro.toLowerCase())
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
              <h2>{editando ? 'Editar Operador' : 'Cadastrar Operadores'}</h2>

              <form onSubmit={handleSubmit}>
                <label style={{ textAlign: 'left', display: 'block' }}>Usuário:</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />

                <label style={{ textAlign: 'left', display: 'block' }}>Senha:</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />

                <label style={{ textAlign: 'left', display: 'block' }}>Confirmar Senha:</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button type="submit" className="btn-primary">
                    {editando ? 'Salvar Alterações' : 'Cadastrar'}
                    </button>
                    {editando && (
                        <button type="button" onClick={() => { setEditando(null); setNome(''); }} style={{ background: '#666', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer' }}>
                            Cancelar
                        </button>
                    )}
                </div>
              </form>

              {mensagem && (
                <p style={{ marginTop: '15px', color: mensagem.includes('Erro') ? 'var(--danger)' : 'var(--accent)' }}>
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
                {mostrarLista ? 'Ocultar Lista' : '🔍 Ver Lista de Operadores'}
              </button>

            </div>

            {}
            {mostrarLista && (
                <div className="glass-card wide" style={{ marginTop: '20px', padding: '20px' }}>
                    
                    <h3 style={{ marginBottom: '15px', color: '#333' }}>Lista de Operadores</h3>
                    
                    <input
                    type="text"
                    placeholder="Filtrar por nome..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{ marginBottom: '20px' }}
                    />

                    <div className="tabela-container">
                        <div className="tabela-header" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            <span>Usuário</span>
                            <span>Ações</span>
                        </div>

                        {adminsFiltrados.length > 0 ? (
                            adminsFiltrados.map((admin) => (
                                <div key={admin.id} className="tabela-linha" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                    <span style={{ fontWeight: 'bold' }}>{admin.nome}</span>
                                    
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center'}}>
                                        <button 
                                            className="btn-primary" 
                                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                            onClick={() => handleEdit(admin)}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="btn-danger" 
                                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                            onClick={() => handleDelete(admin.id)}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '20px', color: '#666' }}>
                                Nenhum operador encontrado.
                            </div>
                        )}
                    </div>
                </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default CadastroADM;