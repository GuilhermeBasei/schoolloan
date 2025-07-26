import { Link } from 'react-router-dom'
import './Header.css'
function Header({ toggleSidebar }) {
  return (
    <header className="header">
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>
      <h1 className="logoemp"><Link to="/">SchoolLoan</Link></h1>
      <div className="user-info">
        <span><Link to="/Login">User Name</Link></span>
        <img src="https://i.pravatar.cc/30" alt="user" className="user-avatar" />
      </div>
    </header>
  )
}

export default Header
