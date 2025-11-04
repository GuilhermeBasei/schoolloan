import { useState, useEffect } from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function CadastroEquip() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [patrimonio, setPatrimonio] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [equipamentos, setEquipamentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  // 🔹 Carregar equipamentos do backend
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

  // 🔹 Cadastrar ou editar equipamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      let response;

      if (editandoId) {
        // Edição
        response = await fetch(`http://localhost:3000/equipamentos/${editandoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ patrimonio, descricao }),
        });
      } else {
        // Novo cadastro
        response = await fetch('http://localhost:3000/equipamentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ patrimonio, descricao }),
        });
      }

      if (response.ok) {
        setMensagem(editandoId ? 'Equipamento atualizado com sucesso!' : 'Equipamento cadastrado com sucesso!');
        setPatrimonio('');
        setDescricao('');
        setEditandoId(null);
        carregarEquipamentos();
      } else {
        const data = await response.json();
        setMensagem(data.error || 'Erro ao salvar equipamento.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro na conexão com o servidor.');
    }
  };

  // 🔹 Excluir equipamento
  const excluirEquipamento = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este equipamento?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/equipamentos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setMensagem('Equipamento excluído com sucesso!');
        carregarEquipamentos();
      } else {
        setMensagem('Erro ao excluir equipamento.');
      }
    } catch (error) {
      console.error('Erro ao excluir equipamento:', error);
    }
  };

  // 🔹 Editar equipamento
  const editarEquipamento = (e) => {
    setPatrimonio(e.patrimonio);
    setDescricao(e.descricao);
    setEditandoId(e.id);
    setMensagem('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔹 Filtro — mostra apenas resultados da busca
  const equipamentosFiltrados =
    busca.trim() === ''
      ? []
      : equipamentos.filter(
          (e) =>
            e.descricao.toLowerCase().includes(busca.toLowerCase()) ||
            e.patrimonio.toString().includes(busca)
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
              <h2>Gerenciar Equipamentos</h2>

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

                <button type="submit">
                  {editandoId ? 'Salvar Alterações' : 'Cadastrar'}
                </button>

                {editandoId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditandoId(null);
                      setPatrimonio('');
                      setDescricao('');
                      setMensagem('');
                    }}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: '#777',
                      color: '#fff',
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
                <h3 style={{ color: 'black' }}>Buscar Equipamento</h3>
                <input
                  type="text"
                  placeholder="Digite a descrição ou patrimônio..."
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

              {equipamentosFiltrados.length > 0 && (
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

                  {equipamentosFiltrados.map((e) => (
                    <div
                      key={e.id}
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
                      <span>{e.patrimonio}</span>
                      <span>{e.descricao}</span>
                      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <button
                          onClick={() => editarEquipamento(e)}
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
                          onClick={() => excluirEquipamento(e.id)}
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

export default CadastroEquip;
