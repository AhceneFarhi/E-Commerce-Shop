const mongoose = require('mongoose')
require("dotenv").config()


 module.exports = ()=>{

    
         mongoose.connect(process.env.DB_URI).then((conn)=>{
            console.log(`Connected to mongoDB ^_^ , Data_Base : ${conn.connection.host}` );

         })

   
    // catch (error) {
        
    //     console.log("Connection error ");
    // }
}



