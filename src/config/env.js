
import dotenv from 'dotenv'

dotenv.config()


export const config = {
    // 
    PORT: process.env.PORT,

    // rate limiting
    windowMS : process.env.windowMS || 100,
    limit: process.env.limit,

    //weather api
    weatherApiKey : process.env.weatherApiKey,
    currentWeatherApi: process.env.currentWeatherApi,

    // redis
    redisHost: process.env.redisHost,
    redisUsername: process.env.redisUsername,
    redisPassword: process.env.redisPassword,
    redisDataExpiry: process.env.redisDataExpiry

}


export default config