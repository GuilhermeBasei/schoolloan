import express from 'express';
import dotenv from 'dotenv';

import usuariosRouter from './routes/usuarios.js';
import equipamentosRouter from './routes/equipamentos.js';
import operadoresRouter from './routes/operadores.js';
import emprestimosRouter from './routes/emprestimos.js';

dotenv.config();
const app = express();
app.use(express.json());

// Rotas
app.use('/usuarios', usuariosRouter);
app.use('/equipamentos', equipamentosRouter);
app.use('/operadores', operadoresRouter);
app.use('/emprestimos', emprestimosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
