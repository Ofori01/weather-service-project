import config from "../config/env.js";

export const weatherParams = {
  contentType: "json",
  unitGroup: "metric",
  key: config.weatherApiKey,
};
