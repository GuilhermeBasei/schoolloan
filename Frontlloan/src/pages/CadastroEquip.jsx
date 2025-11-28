import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function CadastroEquip() {
 const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)

  const [mostrarLista, setMostrarLista] = useState(false);


  const [patrimonio, setPatrimonio] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');
  

  const [equipamentos, setEquipamentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState(null);


  const carregarEquipamentos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/equipamentos', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setEquipamentos(data);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
    }
  };

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      let response;
      const body = JSON.stringify({ patrimonio, descricao });
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      if (editandoId) {
        response = await fetch(`http://localhost:3000/equipamentos/${editandoId}`, {
          method: 'PUT',
          headers,
          body,
        });
      } else {
        response = await fetch('http://localhost:3000/equipamentos', {
          method: 'POST',
          headers,
          body,
        });
      }

      if (response.ok) {
        setMensagem(editandoId ? 'Equipamento atualizado!' : 'Equipamento cadastrado!');
        limparFormulario();
        carregarEquipamentos();
        setMostrarLista(true); 
      } else {
        const data = await response.json();
        setMensagem(data.error || 'Erro ao salvar equipamento.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro na conexão com o servidor.');
    }
  };

  const limparFormulario = () => {
    setPatrimonio('');
    setDescricao('');
    setEditandoId(null);
    setMensagem('');
  };


  const excluirEquipamento = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este equipamento?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/equipamentos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        carregarEquipamentos();
      } else {
        setMensagem('Erro ao excluir equipamento.');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };


  const editarEquipamento = (e) => {
    setPatrimonio(e.patrimonio);
    setDescricao(e.descricao);
    setEditandoId(e.id);
    setMensagem('');
    setMostrarLista(false); 
    document.querySelector('.content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const equipamentosFiltrados =
    busca.trim() === ''
      ? []
      : equipamentos.filter(
          (e) =>
            e.descricao.toLowerCase().includes(busca.toLowerCase()) ||
            e.patrimonio.toString().includes(busca)
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
              <h2>{editandoId ? 'Editar Equipamento' : 'Cadastrar Equipamentos'}</h2>

              <form onSubmit={handleSubmit}>
                <label style={{ textAlign: 'left', display: 'block' }}>Patrimônio:</label>
                <input
                  type="number"
                  value={patrimonio}
                  onChange={(e) => setPatrimonio(e.target.value)}
                  required
                />

                <label style={{ textAlign: 'left', display: 'block' }}>Descrição:</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
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
                {mostrarLista ? 'Ocultar Lista' : '🔍 Ver Lista de Equipamentos'}
              </button>

            </div>

            {}
            {mostrarLista && (
                <div className="glass-card wide" style={{ marginTop: '20px', padding: '20px' }}>
                <h3 style={{ color: 'var(--text-dark)', marginBottom: '10px' }}>Buscar Equipamento</h3>
                <input
                    type="text"
                    placeholder="Digite a descrição ou patrimônio..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />

                {equipamentosFiltrados.length > 0 ? (
                    <div className="tabela-container">
                    {}
                    <div className="tabela-header" style={{ gridTemplateColumns: '1fr 2fr 150px' }}>
                        <span>Patrimônio</span>
                        <span>Descrição</span>
                        <span>Ações</span>
                    </div>

                    {}
                    {equipamentosFiltrados.map((e) => (
                        <div 
                            key={e.id} 
                            className="tabela-linha" 
                            style={{ gridTemplateColumns: '1fr 2fr 150px' }}
                        >
                        <span style={{ fontWeight: 'bold' }}>{e.patrimonio}</span>
                        <span>{e.descricao}</span>
                        
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                            className="btn-primary"
                            onClick={() => editarEquipamento(e)}
                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                            >
                            Editar
                            </button>

                            <button
                            className="btn-danger"
                            onClick={() => excluirEquipamento(e.id)}
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
                        {busca ? 'Nenhum equipamento encontrado.' : 'Digite algo para buscar.'}
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

export default CadastroEquip;