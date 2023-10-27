const jwt= require("jsonwebtoken")
module.exports=(req,res,next)=>{
    try{
        // console.log(req)
        const token =req.headers.authorization.split(' ')[1] //
        console.log(token);
        const decodedToken = jwt.verify(token,'secret_key')
        req.userData ={
        
            userId:decodedToken.user_Id,
            userName:decodedToken.user_Name,
            userRole:decodedToken.user_Role,
        } 
        console.log(req.userData) 
        next() //after hitting middleware next step  is to req,res  thus,next() is used
      }
    catch(error)
    {
        return res.status(401).json({message:'auth failed'})
    }
}