import { Router } from "express";
import weatherConditionsRoutes from './weatherConditionsRoute.js'

const router = Router()

router.use('/conditions', weatherConditionsRoutes )


export default router

