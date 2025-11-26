🎓 SchoolLoan

SchoolLoan é um sistema web desenvolvido para gerenciar o empréstimo de equipamentos em ambientes escolares. O objetivo é facilitar o controle de retirada e devolução de itens como notebooks, tablets, projetores e outros dispositivos, garantindo organização e rastreabilidade.

🚀 Tecnologias Utilizadas
Camada	Tecnologias
Frontend	React + Vite
Backend	Node.js + Express + Prisma ORM
Banco	PostgreSQL
Deploy Local	Docker + Docker Compose
🛠️ Funcionalidades

Cadastro e autenticação de operadores

Registro de itens emprestados e devolvidos

Controle de status e prazos

Relatórios de utilização

Controle administrativo

🐳 Rodando com Docker (RECOMENDADO)
📌 Pré-requisitos

Docker Desktop instalado (Windows/Mac/Linux)

▶️ Passo a passo

Clone o repositório:

git clone https://github.com/GuilhermeBasei/schoolloan.git
cd schoolloan


Inicie os serviços com Docker:

docker compose up --build -d


Aplique as migrations do banco:

docker exec -it tcc-backend npx prisma migrate deploy


(Opcional) Rodar seed para criar o primeiro usuário:

docker exec -it tcc-backend npx prisma db seed


Acesse o sistema no navegador:

👉 http://localhost

🔐 Usuário inicial (via seed)
Campo	Valor
Usuário	admin
Senha	123 (ou conforme definido no arquivo seed.js)
