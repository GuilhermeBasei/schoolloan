import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_secreta';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user; // Dados do usuário disponíveis na requisição
    next();
  });
}