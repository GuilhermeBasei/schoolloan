import express from 'express'


const app = express()
app.use(express.json())

const relatorios = []

app.post('/Relatorios', (req, res) => {
    relatorios.push(req.body)
    res.send('Relatório adicionado com sucesso')
});

app.get('/Relatorios', (req, res) => {
    res.json(relatorios)
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});