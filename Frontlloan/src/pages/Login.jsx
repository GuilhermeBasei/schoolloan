import { useState, useContext } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.operador);
        setMensagem('Login realizado com sucesso!');

        setTimeout(() => navigate('/'), 500); 
      } else {
        setMensagem(data.error || 'Usuário ou senha incorretos.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro na conexão com o servidor.');
    }
  };

  return (
    <div className="center-container">
      <div className="glass-card" style={{ maxWidth: '400px', padding: '50px 40px' }}>
        
        <img 
            src={logo} 
            alt="Logo SchoolLoan" 
            className="logo" 
            style={{ width: '100px', marginBottom: '20px' }} 
        />
        
        <h2 style={{ marginBottom: '30px' }}>Bem-vindo(a)</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Usuário</label>
            <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Seu nome de usuário"
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Senha</label>
            <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="Sua senha"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '10px', padding: '12px' }}
          >
            Entrar
          </button>
        </form>

        {mensagem && (
          <p style={{ 
            marginTop: '20px', 
            fontWeight: '600',
            color: mensagem.includes('sucesso') ? 'var(--accent)' : 'var(--danger)' 
          }}>
            {mensagem}
          </p>
        )}
        
      </div>
    </div>
  );
}

export default Login;