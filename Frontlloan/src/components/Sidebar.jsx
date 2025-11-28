import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen }) {
  return (

    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      
      <nav className="sidebar-nav">
        
        {}
        <div className="sidebar-section">
          <h3 className="section-title">Empréstimos</h3>
          <ul>
            <li>
              <NavLink to="/Emprestar">Emprestar</NavLink>
            </li>
            <li>
              <NavLink to="/Recolher">Recolher</NavLink>
            </li>
          </ul>
        </div>

        {}
        <div className="sidebar-section">
          <h3 className="section-title">Relatórios</h3>
          <ul>
            <li>
              <NavLink to="/Relatorios/Diario">Ativos</NavLink>
            </li>
            <li>
              <NavLink to="/Relatorios/Mensal">Inativos</NavLink>
            </li>
          </ul>
        </div>

        {}
        <div className="sidebar-section">
          <h3 className="section-title">Gerenciar</h3>
          <ul>
            <li>
              <NavLink to="/CadastroUser">Usuários</NavLink>
            </li>
            <li>
              <NavLink to="/CadastroEquip">Equipamentos</NavLink>
            </li>
            <li>
              <NavLink to="/CadastroADM">Operadores</NavLink>
            </li>
          </ul>
        </div>

      </nav>
    </aside>
  );
}

export default Sidebar;