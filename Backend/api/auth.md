# Authentication API Documentation

## Register User
- **Route:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "string (optional)",
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response:**
  - Success (201): `{ "message": "User registered successfully", "token": "jwt_token", "user": { "id", "name", "email" } }`
  - Error (400): `{ "message": "User already exists with this email" }`
  - Error (500): `{ "message": "Server error during registration" }`
- **Middleware:** None

## Login (Sign In)
- **Route:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response:**
  - Success (200): `{ "message": "Login successful", "token": "jwt_token", "user": { "id", "name", "email" } }`
  - Error (401): `{ "message": "Invalid credentials" }`
  - Error (500): `{ "message": "Server error during login" }`
- **Middleware:** None

## Logout (Sign Out)
- **Route:** `POST /api/auth/logout`
- **Request Body:** None
- **Response:**
  - Success (200): `{ "message": "Logout successful" }`
- **Middleware:** `authenticateToken` (requires valid JWT token in Authorization header)

## Get Current User (/me)
- **Route:** `GET /api/auth/me`
- **Request Body:** None
- **Response:**
  - Success (200): `{ "user": { "id", "name", "email", "isActive", "createdAt", "updatedAt" } }`
  - Error (401): `{ "message": "Access token required" }` or `{ "message": "Invalid or expired token" }`
  - Error (404): `{ "message": "User not found" }`
  - Error (500): `{ "message": "Server error" }`
- **Middleware:** `authenticateToken` (requires valid JWT token in Authorization header)