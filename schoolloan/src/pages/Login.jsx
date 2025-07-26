import { useState } from 'react'
import './Login.css'
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom'

function Login() {
  return (
    <>
       <div className="container">
      <div className="login-box">
        <img src={logo} alt="Logo SchoolLoan" className="logo" />
        <h2>Bem-vindo(a)</h2>
        <form>
          <label>Usuário:</label>
          <input type="text" />
          <label>Senha:</label>
          <input type="password" />
          <div className="forgot">Esqueceu sua senha?</div>
          <button type="submit">Logar</button>
        </form>
        <div className="create-account" ><Link to="/">LOGIN DIRETO</Link></div>
      </div>
    </div>
    </>
  )
}

export default Login;