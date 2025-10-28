import { useState, useContext } from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // ✅ Importa o contexto

function Login() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ Função de login do contexto

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
        // ✅ Salva o token e o usuário no contexto e localStorage
        login(data.token, data.operador);

        setMensagem('Login realizado com sucesso!');
        navigate('/'); // ✅ Redireciona para a home protegida
      } else {
        setMensagem(data.error || 'Usuário ou senha incorretos.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro na conexão com o servidor.');
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <img src={logo} alt="Logo SchoolLoan" className="logo" />
        <h2>Bem-vindo(a)</h2>
        <form onSubmit={handleSubmit}>
          <label>Usuário:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <div>
            <Link to="/" className="forgot">Esqueceu sua senha?</Link>
          </div>
          <button type="submit">Logar</button>
        </form>
        {mensagem && <p style={{ marginTop: '10px', color: 'white' }}>{mensagem}</p>}
        <div>
          <Link to="/" className="createAccount">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
