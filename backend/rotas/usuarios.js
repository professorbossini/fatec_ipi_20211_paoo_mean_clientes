const express = require('express');
const router = express.Router();
const Usuario = require ('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require ("jsonwebtoken")

router.post('/signup', (req, res) => {
  bcrypt.hash (req.body.password, 10)
  .then (hash => {
    const usuario = new Usuario ({
      email: req.body.email,
      password: hash
    })
    usuario.save()
    .then((result) => {
      res.status(201).json({
        mensagem: 'Usuario criado',
        resultado: result
      });
    })
    .catch((erro) => {
      console.log (erro)
      res.status(500).json({msg: "Falhou"})
    });
  })

});


router.post('/login', (req, res) => {
  let user;
  Usuario.findOne({email: req.body.email}).then(u => {
    user = u;
    if (!u){
      return res.status(401).json({mensagem: 'email invalido'})
    }
    console.log (req.body.password, u.password);
    return bcrypt.compare(req.body.password, u.password)
  })
  .then(resultado => {
    if (!resultado){
      return res.status(401).json({
        mensagem: "Senha inválida"
      })
    }
    const token = jwt.sign(
      { email: user.email, id: user._id},
      process.env.JWT_PASSWORD,
      {expiresIn: '1h'}
    )
    res.status(200).json({token: token});
  })
  .catch( err => {
    console.log(err);
    return res.status(500).json({
      mensagem: "Login falhou"
    })
  })
})

//péssima ideia para login
//http://localhost:3000/api/usuario/login?email=a@email.com&password=123456
// router.get('/login', (req, res) => {

// })

module.exports = router;
