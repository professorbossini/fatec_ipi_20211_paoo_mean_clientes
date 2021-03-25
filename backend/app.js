const express = require ('express')
const cors = require ('cors')
const app = express()

app.use(express.json())
app.use(cors())

const clientes = [
  {
    id: '1',
    nome: 'Jose',
    fone: '11223344',
    email: 'jose@email.com'
  },
  {
    id: '2',
    nome: 'Jaqueline',
    fone: '22113322',
    email: 'jaqueline@email.com'
  }
]

app.post('/api/clientes', (req, res, next) => {
  console.log(req)
  const cliente = req.body
  console.log(cliente)
  res.status(201).json({mensagem: 'Cliente inserido'})
})


app.get ("/api/clientes", (req, res, next) => {
  res.status(200).json({
    mensagem: "Tudo OK",
    clientes: clientes
  })
})



module.exports = app;




