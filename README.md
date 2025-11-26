# 🎓 SchoolLoan

**SchoolLoan** é um sistema web desenvolvido para gerenciar o empréstimo de equipamentos em ambientes escolares.  
O objetivo é facilitar o controle de retirada e devolução de itens como notebooks, tablets, projetores e outros dispositivos, garantindo organização e rastreabilidade.

---

## 🚀 Tecnologias Utilizadas

| Camada      | Tecnologias                         |
|------------|--------------------------------------|
| **Frontend** | React + Vite                       |
| **Backend**  | Node.js + Express + Prisma ORM     |
| **Banco**    | PostgreSQL                         |
| **Deploy**   | Docker + Docker Compose            |

---

## 🛠️ Funcionalidades

- Cadastro e autenticação de operadores
- Registro de itens emprestados e devolvidos
- Controle de status e prazos
- Relatórios de utilização


---

## 🐳 Rodando com Docker

### 📌 Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado

### ▶️ Passo a passo

1. **Clonar o repositório**

```bash
git clone https://github.com/GuilhermeBasei/schoolloan.git
cd schoolloan
docker compose up --build -d
docker exec -it tcc-backend npx prisma migrate deploy
docker exec -it tcc-backend npx prisma db seed
```
2. **Acesse em http://localhost**

🔐 Login padrão gerado pela seed 
Usuário: Admin	
Senha: 123


⚙️ Configuração .env
Backend → Backloan/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/backloan?schema=public"
PORT=3000
JWT_SECRET="senha_super_secreta"

