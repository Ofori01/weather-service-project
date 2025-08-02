import { Router } from "express";
import weatherRoutes from './weather/index.js'




const router  = Router()


router.use('/weather',weatherRoutes)

export default router