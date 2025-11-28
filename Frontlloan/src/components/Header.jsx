import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header({ toggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      {}
      <button 
        className="menu-btn" 
        onClick={toggleSidebar}
        style={{ background: 'transparent', padding: '0 8px', fontSize: '1.5rem', boxShadow: 'none' }}
      >
        ☰
      </button>

      {}
      <div className="logo">
        <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            SchoolLoan
        </Link>
      </div>

      {user && (
        <div className="user-info">
          {}
          <span
            className="user-name"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {user.nome}
          </span>
          
          <img 
            src="https://i.pravatar.cc/30" 
            alt="user" 
            className="user-avatar" 
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="dropdown">
              <button onClick={handleLogout}>Sair</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;