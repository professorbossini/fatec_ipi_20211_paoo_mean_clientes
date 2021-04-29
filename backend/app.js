const express = require ('express')
const cors = require ('cors')
const mongoose = require ('mongoose')
const Cliente = require('./models/cliente')


const userDB = process.env.MONGODB_USER;
const passDB = process.env.MONGODB_PASSWORD;
const clusterDB = process.env.MONGODB_CLUSTER;
const nameDB = process.env.MONGODB_DATABASE;


mongoose.connect(`mongodb+srv://${userDB}:${passDB}@${clusterDB}.mongodb.net/${nameDB}?retryWrites=true&w=majority`, { useNewUrlParser: true })
.then(() => console.log('MongoDB: Conexao OK'))
.catch((erro) => console.log('MongoDB: COnexao NOK: ' + erro))

const app = express()
app.use(express.json())
app.use(cors())

app.post('/api/clientes', (req, res, next) => {
  /*console.log(req)
  const cliente = req.body
  console.log(cliente)*/
  const cliente = new Cliente ({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  })
  //console.log(cliente);
  cliente.save().then(clienteInserido => {
    res.status(201).json({
      mensagem: 'Cliente inserido',
      id: clienteInserido._id
    })
  })
})


app.get ("/api/clientes", (req, res, next) => {
  Cliente.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      mensagem: "Tudo OK",
      clientes: documents
    })
  })
})

//localhost:3000/api/clientes/abcd
app.delete ('/api/clientes/:id', (req, res) => {
  Cliente.deleteOne({_id: req.params.id}).then((resultado) => {
    console.log(resultado);
    res.status(200).json({mensagem: 'Cliente removido'});
  })
})



module.exports = app;




