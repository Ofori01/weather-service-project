import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import config from './config/env.js'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app  = express()

//security
app.use(helmet())


//cors
app.use(cors())

//body parsing
app.use(express.json())
app.use(express.urlencoded({extended: true}))



//logging
app.use(morgan("combined"))



//rate limiting
const limiter = rateLimit({
    windowMs: config.windowMS,
    limit: config.limit,
    message: "Too many requests"
})

app.use('/api/', limiter)


//routes
app.use('/api', routes)

//health check


//404 handler
app.use('*', (req,res)=>{

    return res.status(400).send({

        success: "false",
        message: "Route not found"
    })

})

//global error handler
app.use(errorHandler)

//server

app.listen(config.PORT, ()=>{
    console.log('Weather Api is running')
    console.log(`http://localhost:${config.PORT}`)
})

//Graceful shutdowns
process.on("SIGTERM",()=>{

    console.log("Sigterm received. Shutting down gracefully")
    //close connections

})


process.on("SIGINT",()=>{
    
    console.log("SIGINT received. Shutting down gracefully")

    //close connections
})