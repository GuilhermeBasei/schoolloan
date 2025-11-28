import { useState, useEffect } from 'react';

import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function Relatorios() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [equipamentos, setEquipamentos] = useState([]);
  const [mensagem, setMensagem] = useState('');

  async function getRelatorio() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/equipamentos', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      setEquipamentos(data);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      setMensagem('Erro ao carregar dados.');
    }
  }

 
  async function handleExcluir(id) {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/equipamentos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      setEquipamentos(equipamentos.filter(e => e.id !== id));
    } catch (error) {
      console.error('Erro ao excluir equipamento:', error);
      setMensagem('Erro ao excluir item.');
    }
  }

  useEffect(() => {
    getRelatorio();
  }, []);

  return (
    <div className="app-container" style={{ flexDirection: 'column', height: '100vh' }}>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar isOpen={sidebarOpen} />

        <main className="content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div className="center-container" style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>

            <div className="glass-card wide" style={{ padding: '30px' }}>
              <img
                src={logo}
                alt="Logo SchoolLoan"
                className="logo"
                style={{ width: '80px', marginBottom: '10px' }}
              />
              <h2 style={{ marginBottom: '20px' }}>Relatório Geral de Equipamentos</h2>

              {mensagem && (
                <p style={{ color: 'var(--danger)', marginBottom: '15px' }}>{mensagem}</p>
              )}

              <div className="tabela-container">
                <div className="tabela-header" style={{ gridTemplateColumns: '0.5fr 1fr 2fr 1fr 1fr' }}>
                  <span>ID</span>
                  <span>Patrimônio</span>
                  <span>Descrição</span>
                  <span>Status</span>
                  <span>Ações</span>
                </div>

                {equipamentos.length > 0 ? (
                  equipamentos.map((equip) => (
                    <div
                      className="tabela-linha"
                      key={equip.id}
                      style={{ gridTemplateColumns: '0.5fr 1fr 2fr 1fr 1fr' }}
                    >
                      <span style={{ color: '#666' }}>{equip.id}</span>
                      <span style={{ fontWeight: 'bold' }}>{equip.patrimonio}</span>
                      <span>{equip.descricao}</span>

                      {}
                      <span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          backgroundColor: equip.disponivel ? '#d1fae5' : '#fee2e2',
                          color: equip.disponivel ? '#065f46' : '#991b1b'
                        }}>
                          {equip.disponivel ? 'Disponível' : 'Indisponível'}
                        </span>
                      </span>

                      <span>
                        <button
                          className="btn-danger"
                          onClick={() => handleExcluir(equip.id)}
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                          Excluir
                        </button>
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', color: '#666' }}>
                    Nenhum equipamento encontrado.
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Relatorios;