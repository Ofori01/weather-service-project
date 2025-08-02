import axios from "axios";
import config from "../../config/env.js";
import { weatherParams } from "../../utils/constants.js";
import { json } from "express";

export async function getCurrentWeather(req, res, next) {
  //check if location exists

  const { location } = req.params;

  if (!location) {
    const error = new Error("Please specify location");
    error.statusCode = 400;
    return next(error);
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

      return res.send({
        success: true,
        data: {
          ...response.data.currentConditions,
          resolvedAddress: response.data.resolvedAddress,
        },
      });
    } catch (error) {
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
