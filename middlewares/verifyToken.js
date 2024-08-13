const jwt = require('jsonwebtoken')



// verify Token 
function VerifyToken(req,res,next) {
    const token = req.headers.token

    if (token) {
        
        try {

            decoded= jwt.decode(token,process.env.SECRET_KEY)
            req.user = decoded
            next()
             
        } catch (error) {
            res.status(401).json({message: 'Token is invalid'})
        }

    }else{
        res.status(401).json({message: 'no token provided'})
    }

}



// verify Token and Admin
function VerifyTokenAndAdmin(req,res,next) { 

   VerifyToken(req,res,()=>{

        const isAdmin = req.user.isAdmin

        if ( req.user.isAdmin) {
            next()
            
        } else {
            return res.status(403).json({message:"You are not allowed , only admin allowed"})

        }

   })
}


// verify Token and only user himself 

function VerifyTokenAndUser(req,res,next) { 

    VerifyToken(req,res,()=>{
 
 
         if ( req.user.id === req.params.id) {
             next()
             
         } else {
             return res.status(403).json({message:"You are not allowed , only user himself"})
 
         }
 
    })
 }
 

// verify Token and Authorization (admin or user himself)

function VerifyTokenAndAuthorization(req,res,next) { 

    VerifyToken(req,res,()=>{
 
 
         if ( req.user.id === req.params.id ||  req.user.isAdmin) {
             next()
             
         } else {
             return res.status(403).json({message:"You are not allowed , only user himself or Admin"})
 
         }
 
    })
 }
 



module.exports = {VerifyTokenAndAdmin , VerifyTokenAndUser , VerifyToken , VerifyTokenAndAuthorization}