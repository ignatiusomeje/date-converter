const {Users} = require('./../models/Users');

const authenticate = async (req, res, next)=>{
  const token = req.header('x-auth');
  
    try{
      const user = await Users.findByToken(token);
      if (!user){
       return e
      }

      req.user = user;
      req.token = token
      next();
    }catch(e){
      res.status(401).send('You are unauthorised to perform this action')
    }
};

module.exports = {authenticate}