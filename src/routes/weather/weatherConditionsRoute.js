import { Router } from "express";
import { getCurrentWeather, getDailyWeather } from "../../controllers/weather/weatherController.js";


const router = Router()


//get current weather conditions 
router.get('/:location',getCurrentWeather)
//get daily weather conditions 
router.get("/:location/daily", getDailyWeather)

//get hourly weather conditions
router.get("/:location/hourly")


export default router