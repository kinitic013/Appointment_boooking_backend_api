# College Appointment System Backend

## Project Overview

A backend API for a college appointment system enabling students to book appointments with professors, featuring authentication, slot management, and appointment booking.

## Tech Stack

- **Backend:** Node.js with Express
- **Database:** SQLite
- **Testing:** Jest
- **Database Interaction:** sqlite3

## Project Structure
```
project-root/
│
├── app.js               # Main application configuration
├── index.js             # Entry point
├── package.json         # Project dependencies and scripts
│
├── controllers/         # Business logic
│   ├── auth.js          # Authentication controllers
│   ├── slot.js          # Slot management controllers
│   └── student.js       # Student-specific controllers
│
├── models/              # Database models
│   ├── database.js      # Database connection and setup
│   └── database_test.js # Test database configuration
│
├── routes/              # API route definitions
│   ├── auth.js          # Authentication routes
│   ├── slot.js          # Slot-related routes
│   └── student.js       # Student-specific routes
│
├── utils/               # Utility functions
│   ├── runAll.js        # Utility to run multiple queries
│   └── runQuery.js      # Utility for running individual queries
│
├── app.test.js      # Main application test file
│
├── db.sqlite            # SQLite database file
└── node_modules/        # Dependency packages
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd college-appointment-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Server
```bash
node index.js
```

### Development Mode
```bash
npm run start:dev
```

## Testing

### Run Tests
```bash
npm run test
```

## API Endpoints

### Authentication
- `POST /student/signup`
- `POST /student/login`
- `POST /professor/signup`
- `POST /professor/login`

### Slot Management
- `POST /slots/create`
- `GET /slots/getById` 

### Appointment Booking
- `POST /slot/book`
- `GET /student/allappointment`
- `DELETE /slot/cancel`

## Database Schema

### Tables
- **student**: Stores student information
- **professor**: Stores professor information
- **slot**: Manages time slots and bookings

### Relationships
- Professors can create multiple slots
- Students can book available slots
- Each slot is associated with one professor and optionally one student

## Key Components

### Controllers
- Handle business logic for different modules
- Implement core functionality for authentication, slots, and student operations

### Routes
- Define API endpoint paths
- Map incoming requests to appropriate controller methods

### Models
- Manage database connection
- Define database interactions and queries

### Utils
- Provide helper functions for database operations
- Support query execution and management

## Security Considerations

- Passwords are stored securely (hashed)
- Basic authentication mechanism
- Input validation

```mermaid
erDiagram
    STUDENT ||--o{ SLOT : books
    PROFESSOR ||--o{ SLOT : creates
    
    STUDENT {
        int student_id PK
        string name
        string email
        string password
    }
    
    PROFESSOR {
        int professor_id PK
        string name
        string email
        string password
    }
    
    SLOT {
        int slot_id PK
        int professor_id FK
        datetime start_time
        boolean isBooked
        int student_id FK
    }
