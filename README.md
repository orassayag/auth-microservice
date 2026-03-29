# Auth Microservice

A secure, production-ready Node.js authentication microservice built with Express.js, JWT tokens, and MongoDB. Provides user registration, authentication, and role-based authorization with security best practices.

Built in June 2021. Inspired by [express-rest-boilerplate](https://github.com/danielfsousa/express-rest-boilerplate).

## Features

- 🔐 JWT-based authentication with refresh tokens
- 👤 User registration and management
- 🛡️ Role-based authorization (user/admin)
- 🔒 Secure password hashing with bcrypt
- ✅ Input validation using Joi
- 🗄️ MongoDB with Mongoose ODM
- 🔧 Environment-based configuration
- 📝 Winston logger for structured logging
- 🚀 Express.js with security middleware (Helmet, CORS)
- ⚡ Compression and performance optimization
- 🧹 Graceful shutdown handling

## Architecture Overview

```mermaid
graph TB
    Client[Client Application]
    API[Express API Server]
    Auth[Auth Controller]
    User[User Controller]
    Middleware[Auth Middleware]
    UserModel[User Model]
    TokenModel[RefreshToken Model]
    MongoDB[(MongoDB)]
    
    Client -->|HTTP Request| API
    API --> Middleware
    Middleware -->|Validate JWT| Auth
    API -->|/auth/register| Auth
    API -->|/users| User
    Auth --> UserModel
    User --> UserModel
    UserModel --> MongoDB
    Auth --> TokenModel
    TokenModel --> MongoDB
    
    style Client fill:#e1f5ff
    style API fill:#fff4e1
    style MongoDB fill:#e8f5e9
    style Auth fill:#fce4ec
    style User fill:#fce4ec
```

## System Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API Server
    participant M as Auth Middleware
    participant DB as MongoDB
    
    Note over C,DB: User Registration Flow
    C->>A: POST /auth/register
    A->>A: Validate input (Joi)
    A->>DB: Check email uniqueness
    A->>A: Hash password (bcrypt)
    A->>DB: Save user
    A->>A: Generate JWT + Refresh Token
    A->>C: Return tokens + user data
    
    Note over C,DB: Protected Endpoint Flow
    C->>A: POST /users (with JWT)
    A->>M: Validate JWT
    M->>M: Verify token signature
    M->>M: Check expiration
    M->>M: Verify user role
    M->>A: Authorization granted
    A->>DB: Perform operation
    A->>C: Return response
```

## Getting Started

### Prerequisites

- Node.js (v8 or higher)
- MongoDB (v3.6 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/orassayag/auth-microservice.git
cd auth-microservice
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-strong-secret-key
JWT_EXPIRATION_MINUTES=15
MONGO_URI=mongodb://localhost:27017/auth-microservice
```

4. Start MongoDB:
```bash
# Using MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3001`

## Available Scripts

### Start Server
```bash
npm start
```
Starts the authentication microservice on the configured port.

### Kill Node Processes (Windows)
```bash
npm run kill
```
Forcefully terminates all Node.js processes.

## API Documentation

### Base URL
```
http://localhost:3001
```

### Endpoints

#### Health Check
```http
GET /status
```
Returns server status.

**Response:**
```
OK
```

#### Register New User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "token": {
    "tokenType": "Bearer",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "5f9d88a9b54764421b7156d8",
    "expiresIn": "2024-12-31T15:30:00.000Z"
  },
  "user": {
    "id": "5f9d88a9b54764421b7156d9",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-12-01T10:15:30.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors (missing fields, invalid email, weak password)
- `409 Conflict` - Email already exists

#### Create User (Admin Only)
```http
POST /users
Authorization: Bearer {jwt-token}
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePass123",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "id": "5f9d88a9b54764421b7156da",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "user",
  "createdAt": "2024-12-01T10:20:45.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - User is not an admin
- `409 Conflict` - Email already exists

## Project Structure

```
auth-microservice/
├── src/
│   ├── api/
│   │   ├── controllers/           # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   └── user.controller.js
│   │   ├── middlewares/           # Custom middleware
│   │   │   └── auth.middleware.js
│   │   ├── models/                # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   └── refreshToken.model.js
│   │   ├── routes/                # API routes
│   │   │   ├── index.js
│   │   │   └── files/
│   │   │       ├── auth.route.js
│   │   │       └── user.route.js
│   │   ├── utils/                 # Utility classes
│   │   │   └── APIError.utils.js
│   │   └── validations/           # Joi schemas
│   │       ├── auth.validation.js
│   │       └── user.validation.js
│   ├── config/                    # Configuration
│   │   ├── error.config.js
│   │   ├── express.config.js
│   │   ├── logger.config.js
│   │   ├── mongoose.config.js
│   │   └── vars.config.js
│   └── index.js                   # Entry point
├── .env.example                   # Environment template
├── .eslintrc                      # ESLint config
├── .gitignore
├── LICENSE
├── package.json
├── CONTRIBUTING.md
├── INSTRUCTIONS.md
└── README.md
```

## Security Features

This microservice implements multiple security best practices:

### Authentication & Authorization
- JWT tokens with configurable expiration
- Refresh token mechanism for extended sessions
- Role-based access control (RBAC)
- Password hashing using bcrypt with configurable rounds

### Input Validation
- Joi schemas for all incoming requests
- Email format validation
- Password strength requirements (8-40 characters)
- Input sanitization and trimming

### HTTP Security
- Helmet.js for secure HTTP headers
- CORS configuration for cross-origin requests
- Compression for performance
- Method override support

### Database Security
- Mongoose for safe query building
- Unique email constraint
- Indexed fields for performance
- Duplicate email detection

### Error Handling
- Custom error classes
- Proper HTTP status codes
- Graceful shutdown on process termination
- Winston logging for debugging

## Environment Configuration

### Development
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=dev-secret-key
JWT_EXPIRATION_MINUTES=15
MONGO_URI=mongodb://localhost:27017/auth-microservice
```

### Production
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=super-strong-random-secret-key-change-this
JWT_EXPIRATION_MINUTES=15
MONGO_URI=mongodb://username:password@host:port/database
```

**Security Note:** Always use strong, random JWT secrets in production and never commit `.env` files to version control.

## Database Models

### User Model
```javascript
{
  email: String,          // Unique, lowercase, validated email
  password: String,       // Bcrypt hashed password
  name: String,           // User's full name (2-128 chars)
  role: String,           // 'user' or 'admin'
  picture: String,        // Optional profile picture URL
  services: {
    facebook: String,     // OAuth service IDs
    google: String
  },
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

### RefreshToken Model
```javascript
{
  user: ObjectId,         // Reference to User
  token: String,          // Refresh token value
  expires: Date,          // Expiration timestamp
  createdAt: Date
}
```

## Testing

### Manual Testing with cURL

**Register a user:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Create user as admin:**
```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New User",
    "email": "new@example.com",
    "password": "password123",
    "role": "user"
  }'
```

## Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
- Ensure MongoDB is running: `systemctl status mongod` or `brew services list`
- Check the connection string in `.env`
- Verify network access and firewall rules

**Port Already in Use:**
- Change the `PORT` in `.env`
- Kill existing processes: `npm run kill` (Windows) or `killall node` (Linux/Mac)

**JWT Token Expired:**
- Tokens expire based on `JWT_EXPIRATION_MINUTES`
- Use refresh token endpoint to get new access token (implementation needed)
- Re-authenticate if both tokens expired

**Validation Errors:**
- Check request body matches the API schema
- Password must be 8-40 characters
- Name must be 2-128 characters
- Email must be valid format

## Contributing

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Everyone is welcome to contribute. Contributing doesn't just mean submitting pull requests—there are many different ways to get involved, including answering questions, reporting issues, and improving documentation.

Please feel free to contact me with any question, comment, pull-request, issue, or any other thing you have in mind.

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag

## License

This application has an MIT license - see the [LICENSE](LICENSE) file for details.
