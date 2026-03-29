# Instructions

## Setup Instructions

1. Open the project in your IDE (VSCode recommended)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (see Configuration section below)
4. Start MongoDB server locally or use a remote MongoDB instance
5. Run the application:
   ```bash
   npm start
   ```

## Configuration

### Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure the following environment variables in `.env`:

   ```env
   NODE_ENV=development
   PORT=3001
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRATION_MINUTES=15
   MONGO_URI=mongodb://localhost:27017/auth-microservice
   MONGO_URI_TESTS=mongodb://localhost:27017/auth-microservice-tests
   ```

### Configuration Variables Explained

- **NODE_ENV**: Environment mode (`development`, `production`, or `test`)
- **PORT**: Port number where the server will listen (default: 3001)
- **JWT_SECRET**: Secret key for JWT token signing (use a strong random string)
- **JWT_EXPIRATION_MINUTES**: Token expiration time in minutes (default: 15)
- **MONGO_URI**: MongoDB connection string for the main database
- **MONGO_URI_TESTS**: MongoDB connection string for test database

### Security Considerations

- Never commit the `.env` file to version control
- Use strong, random values for `JWT_SECRET` in production
- Use different JWT secrets for development and production
- Use different MongoDB databases for development, testing, and production

## Running the Application

### Development Mode
```bash
npm start
```
The server will start on the configured port (default: http://localhost:3001)

### Production Mode
```bash
NODE_ENV=production npm start
```

### Kill Node Process (Windows)
```bash
npm run kill
```

## API Endpoints

### Health Check
```
GET /status
```
Returns `OK` if the server is running.

### Authentication

#### Register New User
```
POST /auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": {
    "tokenType": "Bearer",
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here",
    "expiresIn": "2024-01-01T00:00:00.000Z"
  },
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### User Management

#### Create User (Admin Only)
```
POST /users
```
**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "user"
}
```

## Project Structure

```
auth-microservice/
├── src/
│   ├── api/
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Auth, error handling
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API route definitions
│   │   │   └── files/      # Individual route files
│   │   ├── utils/          # Utility functions
│   │   └── validations/    # Joi validation schemas
│   ├── config/             # Configuration files
│   │   ├── error.config.js
│   │   ├── express.config.js
│   │   ├── logger.config.js
│   │   ├── mongoose.config.js
│   │   └── vars.config.js
│   └── index.js           # Application entry point
├── .env.example           # Example environment variables
├── .eslintrc              # ESLint configuration
├── package.json
└── README.md
```

## Database Models

### User Model
- **email**: Unique email address (lowercase, validated)
- **password**: Hashed password (bcrypt, min 8 chars, max 40 chars)
- **name**: User's full name (min 2 chars, max 128 chars)
- **role**: User role (`user` or `admin`)
- **picture**: Optional profile picture URL
- **services**: OAuth service IDs (Facebook, Google)
- **timestamps**: Created and updated timestamps

### RefreshToken Model
- Stores refresh tokens for JWT token renewal
- Links to user accounts
- Has expiration management

## Testing the API

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Check server status:**
```bash
curl http://localhost:3001/status
```

### Using Postman or Insomnia

1. Import the API endpoints
2. Set the base URL to `http://localhost:3001`
3. For protected routes, add the Authorization header:
   ```
   Authorization: Bearer {your-jwt-token}
   ```

## Common Issues and Solutions

### MongoDB Connection Error
- Ensure MongoDB is running locally or the connection string is correct
- Check if the MongoDB port (default 27017) is accessible
- Verify network connectivity for remote MongoDB instances

### Port Already in Use
- Change the PORT in `.env` file
- Kill existing Node processes using `npm run kill` (Windows)
- On Linux/Mac: `killall node` or `lsof -ti:3001 | xargs kill`

### JWT Token Expired
- Tokens expire based on `JWT_EXPIRATION_MINUTES`
- Use the refresh token to get a new access token
- Re-authenticate if refresh token is also expired

### Validation Errors
- Check request body format matches the API documentation
- Ensure all required fields are provided
- Verify data types and constraints (min/max length)

## Development Tools

### Linting
The project uses ESLint with Airbnb configuration for code quality.

### Logging
Winston logger is configured for:
- Development: Console output with colors
- Production: File-based logging with rotation

### Security
- **Helmet**: Sets secure HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Compression**: Response compression for better performance
- **bcrypt**: Secure password hashing
- **Joi**: Input validation and sanitization

## Notes

- The application uses Bluebird as the default Promise implementation
- Graceful shutdown is implemented for SIGTERM and SIGINT signals
- All passwords are automatically hashed before saving to database
- JWT tokens include user ID and expiration time
- Default token expiration is 15 minutes (configurable)

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag
