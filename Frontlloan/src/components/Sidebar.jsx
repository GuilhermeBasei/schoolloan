import { Link } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {isOpen && (
        <>
          <div className="section">
            <strong>Empréstimos</strong>
            <ul>
              <li><Link to="/Emprestar">Emprestar</Link></li>
              <li><Link to="/Recolher">Recolher</Link></li>
            </ul>
          </div>
          <div className="section">
            <strong>Relatórios</strong>
            <ul>
              <li><Link to="/Relatorios/Diario">Ativos</Link></li>
              <li><Link to="/Relatorios/Mensal">Inativos</Link></li>
            </ul>
          </div>
          <div className="section">
            <strong>Gerenciar</strong>
            <ul>
              <li><Link to="/CadastroUser">Usuários</Link></li>
              <li><Link to="/CadastroEquip">Equipamentos</Link></li>
              <li><Link to="/CadastroADM">Operadores</Link></li>
            </ul>
          </div>
        </>
      )}
    </aside>
  )
}

export default Sidebar

