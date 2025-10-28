import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ toggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Pega o usuário do localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('usuario'); // limpa login
    navigate('/login'); // redireciona para login
  };

  return (
    <header className="header">
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>
      <h1 className="logoemp"><Link to="/">SchoolLoan</Link></h1>

      {usuario && (
        <div className="user-info">
          <span 
            className="user-name" 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ cursor: 'pointer' }}
          >
            {usuario.operador.nome}
          </span>
          <img src="https://i.pravatar.cc/30" alt="user" className="user-avatar" />

          {menuOpen && (
            <div className="dropdown">
              <button onClick={handleLogout}>Deslogar</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
