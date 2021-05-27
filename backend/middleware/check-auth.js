const jwt = require ('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_PASSWORD);
    next()
  }
  catch (err){
    console.log(err);
    res.status(401).json({
      mensagem: "Autenticação falhou"
    })
  }
}
