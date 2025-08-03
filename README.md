# Weather Service API

A high-performance Node.js weather service API built with Express.js, featuring Redis caching, rate limiting, and comprehensive weather data endpoints. This service provides current, daily, and hourly weather information with intelligent caching mechanisms for optimal performance.

## 🚀 Features

- **Current Weather Conditions** - Real-time weather data for any location
- **Daily Weather Forecasts** - Multi-day weather forecasts
- **Hourly Weather Data** - Detailed hourly weather information
- **Redis Caching** - Server-side and client-side caching for improved performance
- **Rate Limiting** - API protection against abuse
- **Error Handling** - Comprehensive global error handling
- **Security** - Helmet.js security headers and CORS support
- **Logging** - Morgan HTTP request logging
- **Graceful Shutdown** - Proper cleanup on process termination

## 🛠️ Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Caching**: Redis Cloud with client-side caching
- **HTTP Client**: Axios
- **Weather Data**: Visual Crossing Weather API
- **Security**: Helmet.js, CORS, Rate Limiting
- **Validation**: Express Validator
- **Logging**: Morgan
- **Development**: Nodemon

## 📋 Prerequisites

- Node.js (v14+ recommended)
- Redis Cloud account or local Redis instance
- Visual Crossing Weather API key

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ofori01/weather-service-project.git
   cd weather-service-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=3005

   # Rate Limiting
   windowsMs=90000
   limit=100

   # Weather API
   weatherApiKey=YOUR_VISUAL_CROSSING_API_KEY
   currentWeatherApi=https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline

   # Redis Configuration
   redisHost=your-redis-host
   redisUsername=default
   redisPassword=your-redis-password
   redisDataExpiry=1800
   ```

4. **Start the application**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 🔗 API Endpoints

### Base URL

``` js
http://localhost:3005/api
```

### Weather Endpoints

#### Get Current Weather

```http
GET /api/weather/conditions/{location}
```

**Parameters:**

- `location` (required): City name, coordinates, or address

**Example:**

```bash
curl http://localhost:3005/api/weather/conditions/London
```

**Response:**

```json
{
  "success": true,
  "data": {
    "temp": 22.5,
    "humidity": 65,
    "conditions": "Partly cloudy",
    "windspeed": 15.2,
    "visibility": 10,
    "resolvedAddress": "London, England, United Kingdom"
  }
}
```

#### Get Daily Weather Forecast

```http
GET /api/weather/conditions/{location}/daily
```

**Parameters:**

- `location` (required): City name, coordinates, or address

**Example:**

```bash
curl http://localhost:3005/api/weather/conditions/NewYork/daily
```

**Response:**

```json
{
  "success": true,
  "data": {
    "days": [
      {
        "datetime": "2025-08-03",
        "tempmax": 28.5,
        "tempmin": 18.2,
        "conditions": "Rain",
        "description": "Cloudy skies throughout the day with periods of rain."
      }
    ],
    "resolvedAddress": "New York, NY, United States"
  }
}
```

#### Get Hourly Weather Data

```http
GET /api/weather/conditions/{location}/hourly
```

**Parameters:**

- `location` (required): City name, coordinates, or address

**Example:**

```bash
curl http://localhost:3005/api/weather/conditions/Tokyo/hourly
```

## 🗄️ Redis Implementation

### Server-Side Caching

The application implements comprehensive Redis caching to optimize API performance and reduce external API calls.

**Cache Configuration:**

- **TTL (Time To Live)**: 1800 seconds (30 minutes)
- **Key Pattern**: `weather:{type}:{location}`
- **Storage Format**: JSON stringified weather data

**Cache Keys:**

- Current weather: `weather:current:{location}`
- Daily forecast: `weather:daily:{location}`
- Hourly data: `weather:hourly:{location}`

**Caching Strategy:**

1. Check Redis cache for existing data
2. If cache hit: Return cached data immediately
3. If cache miss: Fetch from weather API
4. Store fresh data in Redis with TTL
5. Return data to client

### Client-Side Caching

The Redis client implements client-side caching for additional performance optimization:

```javascript
clientSideCache: {
    ttl: 30 * 60 * 1000,    // 30 minutes in milliseconds
    maxEntries: 100,         // Maximum cached entries
    evictPolicy: "LRU"       // Least Recently Used eviction
}
```

**Benefits:**

- **Reduced Latency**: Frequently accessed data served from local cache
- **Network Efficiency**: Fewer round trips to Redis server
- **Automatic Management**: LRU eviction policy manages memory usage
- **Configurable TTL**: Balances performance with data freshness

### Cache Flow Diagram

```bash
Client Request
      ↓
Client-Side Cache Check
      ↓
Server-Side Redis Cache Check
      ↓
External Weather API (if cache miss)
      ↓
Store in Redis + Client Cache
      ↓
Return Response
```

## 🔒 Security Features

### Rate Limiting

- **Window**: 90 seconds (configurable)
- **Limit**: 100 requests per window per IP
- **Scope**: Applied to all `/api/*` endpoints
- **Response**: 429 status with "Too many requests" message

### Security Headers

- **Helmet.js**: Comprehensive security headers
- **CORS**: Cross-Origin Resource Sharing enabled
- **Input Validation**: Express Validator for request validation

### Error Handling

- **Global Error Handler**: Centralized error processing
- **Structured Responses**: Consistent error response format
- **Error Logging**: Comprehensive error logging for debugging

## 📁 Project Structure

``` bash
weather-service-project/
├── src/
│   ├── app.js                 # Application entry point
│   ├── config/
│   │   ├── env.js            # Environment configuration
│   │   └── redis.js          # Redis client configuration
│   ├── controllers/
│   │   └── weather/
│   │       └── weatherController.js  # Weather business logic
│   ├── middlewares/
│   │   ├── errorHandler.js   # Global error handling
│   │   └── validation.js     # Request validation
│   ├── routes/
│   │   ├── index.js          # Main router
│   │   └── weather/
│   │       ├── index.js      # Weather route grouping
│   │       └── weatherConditionsRoute.js  # Weather endpoints
│   └── utils/
│       └── constants.js      # Application constants
├── package.json
├── .env                      # Environment variables
└── README.md
```

## 🚥 Environment Variables

| Variable            | Description               | Default | Required |
| ------------------- | ------------------------- | ------- | -------- |
| `PORT`              | Server port               | 3005    | ✅       |
| `windowsMs`         | Rate limiting window (ms) | 90000   | ✅       |
| `limit`             | Request limit per window  | 100     | ✅       |
| `weatherApiKey`     | Visual Crossing API key   | -       | ✅       |
| `currentWeatherApi` | Weather API base URL      | -       | ✅       |
| `redisHost`         | Redis server hostname     | -       | ✅       |
| `redisUsername`     | Redis username            | default | ✅       |
| `redisPassword`     | Redis password            | -       | ✅       |
| `redisDataExpiry`   | Cache TTL in seconds      | 1800    | ✅       |

## 🐛 Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes

- **400**: Bad Request (missing location parameter)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error (API or database issues)

## 🚀 Performance Optimizations

### Caching Strategy

- **Multi-level caching**: Client-side + Server-side Redis caching
- **Intelligent TTL**: 30-minute cache expiration for weather data
- **Cache-first approach**: Always check cache before external API calls

### Request Optimization

- **Connection pooling**: Efficient HTTP client configuration
- **Compression**: Built-in Express compression
- **Keep-alive**: Persistent connections for better performance

## 📈 Monitoring & Logging

### HTTP Request Logging

- **Morgan**: Combined log format for comprehensive request tracking
- **Log Format**: Includes IP, method, URL, status, response time, and user agent

### Error Logging

- **Comprehensive Error Tracking**: All errors logged with context
- **Redis Connection Monitoring**: Connection status and error tracking

## 🔄 Graceful Shutdown

The application implements graceful shutdown handling:

```javascript
// SIGTERM and SIGINT handlers
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  client.destroy(); // Close Redis connections
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully");
  client.destroy(); // Close Redis connections
});
```

## 📊 API Usage Examples

### Using cURL

```bash
# Get current weather for London
curl -X GET "http://localhost:3005/api/weather/conditions/London"

# Get daily forecast for coordinates
curl -X GET "http://localhost:3005/api/weather/conditions/40.7128,-74.0060/daily"

# Get hourly data for a specific city
curl -X GET "http://localhost:3005/api/weather/conditions/Paris/hourly"
```

### Using JavaScript (fetch)

```javascript
// Get current weather
const getCurrentWeather = async (location) => {
  try {
    const response = await fetch(
      `http://localhost:3005/api/weather/conditions/${location}`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

getCurrentWeather("London");
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Visual Crossing Weather API](https://www.visualcrossing.com/) for weather data
- [Redis Cloud](https://redis.com/redis-enterprise-cloud/) for caching infrastructure
- Express.js community for the excellent framework

## 📞 Support

For support, email <oforidarkwah7@gamil.com> or create an issue in the repository.

---

### Made with ❤️ for efficient weather data services
