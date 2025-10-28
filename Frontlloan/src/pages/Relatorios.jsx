import { useState, useEffect } from 'react';
import './Relatorios.css';
import logo from '../assets/logo.png';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

function Relatorios() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [equipamentos, setEquipamentos] = useState([]);

  async function getRelatorio() {
    try {
      const response = await api.get('/equipamentos');
      setEquipamentos(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
    }
  }

  async function handleExcluir(id) {
    try {
      await api.delete(`/equipamentos/${id}`);
      setEquipamentos(equipamentos.filter(e => e.id !== id));
    } catch (error) {
      console.error('Erro ao excluir equipamento:', error);
    }
  }

  useEffect(() => {
    getRelatorio();
  }, []);

  return (
    <div className="container">
      <div className="app">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main">
          <Sidebar isOpen={sidebarOpen} />
          <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="login-boxfundo">
              <img src={logo} alt="Logo SchoolLoan" className="logo" />
              <h2>Equipamentos Faltando</h2>

              <div className="tabela">
                <div className="tabela-header">
                  <span>ID</span>
                  <span>Patrimônio</span>
                  <span>Descrição</span>
                  <span>Disponível</span>
                  <span>Ações</span>
                </div>

                {equipamentos.map((equip) => (
                  <div className="tabela-linha" key={equip.id}>
                    <span>{equip.id}</span>
                    <span>{equip.patrimonio}</span>
                    <span>{equip.descricao}</span>
                    <span>{equip.disponivel ? 'Sim' : 'Não'}</span>
                    <span>
                      <button onClick={() => handleExcluir(equip.id)}>Excluir</button>
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;
