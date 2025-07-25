function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="section">
        <strong>Empréstimos</strong>
        <ul>
          <li className="disabled">Emprestar</li>
          <li className="disabled">Recolher equipamento</li>
        </ul>
      </div>
      <div className="section">
        <strong>Relatórios</strong>
        <ul>
          <li>Empréstimos DIA</li>
          <li>Empréstimos MÊS</li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
