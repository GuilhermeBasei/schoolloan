function Header({ toggleSidebar }) {
  return (
    <header className="header">
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>
      <h1 className="logo">SchoolLoan</h1>
      <div className="user-info">
        <span>Guilherme Basei</span>
        <img src="https://i.pravatar.cc/30" alt="user" className="user-avatar" />
      </div>
    </header>
  )
}

export default Header
