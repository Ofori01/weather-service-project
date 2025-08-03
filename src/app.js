import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import config from './config/env.js'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { initRedis } from './config/redis.js'

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
    windowMs:parseInt( config.windowMS),
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


// redis client
let client;

//server

app.listen(config.PORT, async ()=>{

    //init redis
    client  = await initRedis()

    console.log("Redis ready status",client.isReady)

    console.log('Weather Api is running')

    console.log(`http://localhost:${config.PORT}`)
})

//Graceful shutdowns
process.on("SIGTERM",()=>{

    console.log("Sigterm received. Shutting down gracefully")
    //close connections
    client.destroy()

})


process.on("SIGINT",()=>{
    
    console.log("SIGINT received. Shutting down gracefully")

    //close connections
    client.destroy()

})

//export redis client

export {client}