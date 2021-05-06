const express = require('express');
const Cliente = require('../models/cliente')
const router = express.Router();


router.post('', (req, res, next) => {
  /*console.log(req)
  const cliente = req.body
  console.log(cliente)*/
  const cliente = new Cliente({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  });
  //console.log(cliente);
  cliente.save().then(clienteInserido => {
    res.status(201).json({
      mensagem: 'Cliente inserido',
      id: clienteInserido._id
    });
  });
});

router.get('/:id', (req, res) => {
  Cliente.findById(req.params.id).then(cli => {
    if (cli)
      res.status(200).json(cli);
    else
      res.status(404).json({ mensagem: "Cliente não encontrado" });
  });
});

router.get("", (req, res, next) => {
  Cliente.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      mensagem: "Tudo OK",
      clientes: documents
    });
  });
});

//localhost:3000/api/clientes/abcd
router.delete('/:id', (req, res) => {
  Cliente.deleteOne({ _id: req.params.id }).then((resultado) => {
    console.log(resultado);
    res.status(200).json({ mensagem: 'Cliente removido' });
  });
});

//http://localhost:3000/api/clientes/123456
router.put('/:id', (req, res, next) => {
  const cliente = new Cliente({
    _id: req.params.id,
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  });
  Cliente.updateOne({ _id: req.params.id }, cliente)
    .then((resultado) => {
      console.log(resultado);
      res.status(200).json({ mensagem: "Atualização realizada com sucesso" });
    });
})

module.exports = router;
