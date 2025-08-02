import { Router } from "express";
import { getCurrentWeather } from "../../controllers/weather/weatherController.js";


const router = Router()


//get current weather conditions 
router.get('/:location',getCurrentWeather)
//get daily weather conditions 

//get hourly weather conditions


export default router