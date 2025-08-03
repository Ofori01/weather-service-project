import { createClient } from "redis"
import config from "./env.js"


export async function initRedis() {
    const client  = createClient({
        RESP: 3,
        username: config.redisUsername,
        password: config.redisPassword,
        socket: {
            host: config.redisHost,
            port: 16507
        },
        clientSideCache: {
            ttl: 30 * 60 * 1000,
            maxEntries: 100,
            evictPolicy: "LRU"
        }
    
    })
    
    client.on('error', err =>{
        console.log('Redis Client Error', err)
        process.exit(1)
    });

    await client.connect()
    

    return client
}