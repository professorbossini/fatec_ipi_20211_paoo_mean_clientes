const express = require('express');
const multer = require ('multer');
const Cliente = require('../models/cliente')
const router = express.Router();

const checkAuth = require('../middleware/check-auth')

const MIME_TYPE_EXTENSAO_MAPA = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/bmp': 'bmp'
}

const armazenamento = multer.diskStorage({
  destination: (req, file, callback) => {
    let e = MIME_TYPE_EXTENSAO_MAPA[file.mimetype] ? null : new Error ('Mime Type Inválido');
    callback(e, 'backend/imagens')
  },
  filename: (req, file, callback) => {
    const nome = file.originalname.toLowerCase().split(" ").join('-');
    const extensao = MIME_TYPE_EXTENSAO_MAPA[file.mimetype];
    callback(null, `${nome}-${Date.now()}.${extensao}`)
  }
});



router.post('', checkAuth, multer({storage: armazenamento}).single('imagem'), (req, res, next) => {
  const imagemURL = `${req.protocol}://${req.get('host')}`;
  const cliente = new Cliente({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email,
    imagemURL: `${imagemURL}/imagens/${req.file.filename}`
  });
  //console.log(cliente);
  cliente.save().then(clienteInserido => {
    res.status(201).json({
      mensagem: 'Cliente inserido',
      cliente: {
        id: clienteInserido._id,
        nome: clienteInserido.nome,
        fone: clienteInserido.fone,
        email: clienteInserido.email,
        imagemURL: clienteInserido.imagemURL,
      }
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
  const pageSize = +req.query.pageSize;
  const page = +req.query.page;
  const consulta = Cliente.find();
  if (pageSize && page){
    consulta.skip(pageSize *(page - 1)).limit(pageSize);
  }
  let clientesEncontrados;
  consulta.then(documents => {
    clientesEncontrados = documents;
    return Cliente.count()

  }).then(count => {
    res.status(200).json({
      mensagem: "Tudo OK",
      clientes: clientesEncontrados,
      maxClientes: count
    });
  });
});

//localhost:3000/api/clientes/abcd
router.delete('/:id', checkAuth, (req, res) => {
  Cliente.deleteOne({ _id: req.params.id }).then((resultado) => {
    console.log(resultado);
    res.status(200).json({ mensagem: 'Cliente removido' });
  });
});

//http://localhost:3000/api/clientes/123456
router.put(
 '/:id',
 checkAuth,
  multer({ storage: armazenamento}).single('imagem'),
  (req, res, next) => {
  let imagemURL = req.body.imagemURL;
  if (req.file){
    const url = req.protocol + "://" + req.get('host');
    imagemURL = url + "/imagens/" + req.file.filename;
  }
  const cliente = new Cliente({
    _id: req.params.id,
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email,
    imagemURL: imagemURL
  });
  Cliente.updateOne({ _id: req.params.id }, cliente)
    .then((resultado) => {
      console.log(resultado);
      res.status(200).json({ mensagem: "Atualização realizada com sucesso" });
    });
})

module.exports = router;
