import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { AuthContext } from '../context/AuthContext'; // ✅ Importa contexto

function Header({ toggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // ✅ pega usuário do contexto

  const handleLogout = () => {
    logout(); // ✅ limpa token e usuário do contexto e localStorage
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>
      <h1 className="logoemp"><Link to="/">SchoolLoan</Link></h1>

      {user && (
        <div className="user-info">
          <span
            className="user-name"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ cursor: 'pointer' }}
          >
            {user.nome} {/* ✅ mostra o nome do usuário do contexto */}
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
