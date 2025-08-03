import axios from "axios";
import config from "../../config/env.js";
import { weatherParams } from "../../utils/constants.js";
import { json } from "express";
import { client } from "../../app.js";

export async function getCurrentWeather(req, res, next) {



  //check if location exists


  const { location } = req.params;

  if (!location) {
    const error = new Error("Please specify location");
    error.statusCode = 400;
    return next(error);
  }


  //check for cached data
  const cachedData = await client.get(`weather:current:${location}`);

  if(cachedData != null){
    console.log('serving cached data')
    return res.send({
      success: true,
      data: JSON.parse(cachedData)
    })
  }


  if (config.currentWeatherApi) {
    try {
      //make request to weather api
      console;
      const response = await axios.get(
        `${config.currentWeatherApi.toString()}/${location}`,
        {
          params: {
            ...weatherParams,
            include: "current",
          },
        }
      );

      //set results in redis store
      await client.setEx(`weather:current:${location}`,  parseInt(config.redisDataExpiry), JSON.stringify({
        ...response.data.currentConditions,
        resolvedAddress: response.data.resolvedAddress,
        timestamp: new Date().toLocaleString()
      }
      ))


      return res.send({
        success: true,
        data: {
          ...response.data.currentConditions,
          resolvedAddress: response.data.resolvedAddress,
        },
      });
    } catch (error) {
      console.log(error)
      return next(new Error("Error fetching weather details"));
    }
  } else {
    next(new Error());
  }
}

export async function getDailyWeather(req, res, next) {
  const { location } = req.params;

  //location check

  if (!location) {
    const error = new Error("Please specify location");
    error.statusCode = 400;
    next(error);
  }

  //check for cached data
  const cachedData = client.get(`weather:daily:${location}`)

  if (!config.currentWeatherApi) return next(new Error(""));

  try {
    const response = await axios.get(
      `${config.currentWeatherApi}/${location}`,
      {
        params: {
          ...weatherParams,
          include: "days",
        },
      }
    );


    //set data in redis store

    await client.setEx(`weather:daily:${location}`, parseInt(config.redisDataExpiry),JSON.stringify({
      days: response.data.days,
      resolvedAddress: response.data.resolvedAddress
    }))



    return res.send({
        success: true,
      data: {
        days: response.data.days,
        resolvedAddress: response.data.resolvedAddress,
      },
    });
  } catch (error) {
    console.log(error);
    next(new Error(""));
  }
}

export async function getHourlyWeather(req, res, next) {
  const { location } = req.params;

  if (!location) {
    const error = new Error("Please specify location");
    error.statusCode = 400;
    next(error);
  }

  if (!config.currentWeatherApi) return next(new Error(""));

  try {
    const response = await axios.get(`${config.currentWeatherApi}/${location}`, {
      params: {
          ...weatherParams,
          include: "hours"
      }
    })
  
    return res.send({
        success: true,
        data: {
            days: response.data.days,
            resolvedAddress: response.data.resolvedAddress
        }
        
    })
  } catch (error) {
    console.log(error)
    next(new Error())
    
  }
}
