const path = require('path');
const express = require('express')
require("dotenv").config()
const connectToDb = require('./config/connectToDb')
const globalError = require('./middlewares/errorMiddlewares');
const logger = require('./middlewares/logger');
const cors = require('cors'); 
const compression = require('compression');



// Connect to mongodb server
connectToDb()

const app = express()

// Enable other domains to access your application
app.use(cors());
app.options('*', cors());


// compress all responses
app.use(compression()); 


// Apply Middleware
app.use(logger)
app.use(express.json())
// app.use(express.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname, 'uploads')))


// Routes
const mountRoutes = require('./routers/index')
mountRoutes(app)


//Error handler Middleware 
// Global error handling middleware for express
app.use(globalError);


const PORT = process.env.PORT || 8000

const server = app.listen(PORT,()=> console.log("Server listening on port " +PORT))

//  Handle recjetion outside Express
process.on('unhandleRejection',(err)=>{
   console.error(`UnhandleRejection Errors : ${err.name} | ${err.message}`)
   server.close(()=>{
     console.error(`Shutting down....`)
     process.exit(1)
   })
})




