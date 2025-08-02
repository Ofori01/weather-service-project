import { Router } from "express";
import { getCurrentWeather, getDailyWeather, getHourlyWeather } from "../../controllers/weather/weatherController.js";


const router = Router()


//get current weather conditions 
router.get('/:location',getCurrentWeather)
//get daily weather conditions 
router.get("/:location/daily", getDailyWeather)

//get hourly weather conditions
router.get("/:location/hourly",getHourlyWeather)


export default router