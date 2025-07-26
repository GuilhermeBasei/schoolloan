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
              <li><Link to="/Recolher">Recolher equipamento</Link></li>
            </ul>
          </div>
          <div className="section">
            <strong>Relatórios</strong>
            <ul>
              <li><Link to="/Relatorios">Diario</Link></li>
              <li><Link to="/Relatorios">Mensal</Link></li>
            </ul>
          </div>
          <div className="section">
            <strong>Cadastrar</strong>
            <ul>
              <li><Link to="/CadastroUser">Usuário</Link></li>
              <li><Link to="/CadastroEquip">Equipamentos</Link></li>
              <li><Link to="/CadastroADM">Admins</Link></li>
            </ul>
          </div>
        </>
      )}
    </aside>
  )
}

export default Sidebar

