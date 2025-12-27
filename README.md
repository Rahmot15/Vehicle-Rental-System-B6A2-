# Vehicle Rental System

A comprehensive vehicle rental management system built with Node.js, Express, and PostgreSQL. This system allows users to register, authenticate, manage vehicles, and book rentals with a complete admin and customer role-based access control.

## 🚗 Features

### User Management
- **User Registration**: New users can register with name, email, password, phone, and role
- **User Authentication**: Secure JWT-based authentication system
- **Role-based Access Control**: Different permissions for admin and customer roles
- **User Profile Management**: Users can update their profile information

### Vehicle Management
- **Vehicle Creation**: Admins can add new vehicles with details like name, type, registration number, daily rent price, and availability status
- **Vehicle Listing**: View all available vehicles
- **Vehicle Details**: View specific vehicle information
- **Vehicle Updates**: Admins can update vehicle information
- **Vehicle Deletion**: Admins can delete vehicles (with validation to prevent deletion of vehicles with active bookings)

### Booking System
- **Vehicle Booking**: Customers can book available vehicles with specified rental dates
- **Booking Management**: Track booking status (active, cancelled, returned)
- **Price Calculation**: Automatic calculation of total rental price based on daily rate and rental duration
- **Booking Cancellation**: Customers can cancel their own bookings
- **Return Processing**: Admins can mark bookings as returned, which updates vehicle availability
- **Automatic Return**: System automatically marks expired bookings as returned daily
- **Booking History**: Users can view their booking history

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Authorization Middleware**: Role-based access control for different endpoints
- **Password Hashing**: Bcrypt for secure password storage

## 🛠️ Technology Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript superset
- **PostgreSQL**: Relational database management system
- **pg**: PostgreSQL client for Node.js

### Security
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing library
- **dotenv**: Environment variable management

### Development Tools
- **tsx**: TypeScript execution with ESM support
- **typescript**: Static type checking
- **@types**: Type definitions for Express, JWT, and PostgreSQL

## 📋 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Database Setup**
   - Create a PostgreSQL database
   - The system will automatically initialize the database tables on startup

5. **Run the application**
   - For development (with auto-reload):
     ```bash
     npm run dev
     ```
   - For production build:
     ```bash
     npm run build
     npm start
     ```

### API Endpoints

#### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User login

#### User Management (requires authentication)
- `GET /api/v1/users` - Get all users (admin only)
- `PUT /api/v1/users/:userId` - Update user (admin/customer)
- `DELETE /api/v1/users/:userId` - Delete user (admin only)

#### Vehicle Management (requires authentication for write operations)
- `POST /api/v1/vehicles` - Create vehicle (admin only)
- `GET /api/v1/vehicles` - Get all vehicles
- `GET /api/v1/vehicles/:vehicleId` - Get specific vehicle
- `PUT /api/v1/vehicles/:vehicleId` - Update vehicle (admin only)
- `DELETE /api/v1/vehicles/:vehicleId` - Delete vehicle (admin only)

#### Booking Management (requires authentication)
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - Get all bookings (user sees own, admin sees all)
- `PUT /api/v1/bookings/:bookingId` - Update booking status

## 🚀 Usage

1. **Register as a user** using the signup endpoint
2. **Login** to get your JWT token
3. **Include the token** in the Authorization header as `Bearer <token>` for protected endpoints
4. **Admin users** can manage vehicles and process returns
5. **Customer users** can book vehicles and manage their own bookings

## 📝 API Request Examples

### Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "1234567890",
  "role": "customer"
}
```

### Create a booking
```json
{
  "vehicleId": 1,
  "rentStartDate": "2023-12-25",
  "rentEndDate": "2023-12-30"
}
```

### Update booking status (admin only)
```json
{
  "status": "returned"
}
```

## 🛡️ Security Features

- Passwords are securely hashed using bcrypt
- JWT tokens with 7-day expiration
- Role-based access control for all endpoints
- Input validation and sanitization
- Protection against SQL injection through parameterized queries

## 📊 Database Schema

The system uses PostgreSQL with the following main tables:
- `users`: Stores user information with role-based access
- `vehicles`: Contains vehicle details including availability status
- `bookings`: Tracks rental bookings with status and pricing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, please contact the project maintainers or open an issue in the repository.
