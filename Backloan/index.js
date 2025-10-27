import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Inicializações
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors()); 
// Rotas
import usuariosRouter from './src/routes/usuarios.js';
import equipamentosRouter from './src/routes/equipamentos.js';
import operadoresRouter from './src/routes/operadores.js';
import emprestimosRouter from './src/routes/emprestimos.js';

app.use('/usuarios', usuariosRouter);
app.use('/equipamentos', equipamentosRouter);
app.use('/operadores', operadoresRouter);
app.use('/emprestimos', emprestimosRouter);

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
