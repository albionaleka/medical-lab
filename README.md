# Laboratory Management System

A comprehensive web-based laboratory management system for managing patients, test results, and laboratory operations with role-based access control.

## 🎯 Overview

The Laboratory Management System is a full-stack web application designed to streamline laboratory operations. It provides comprehensive tools for managing patients, test categories, test panels, test parameters, and test results. The system features role-based access control with three distinct user roles (Admin, Laborant, and Doctor), ensuring secure and appropriate access to functionality.

## ✨ Features

### User Management

- User registration and authentication with JWT
- Role-based access control (Admin, Laborant, Doctor)
- User profile management
- Password reset via email OTP
- Secure password hashing with bcrypt

### Patient Management

- Create, read, update, and delete patient records
- Track patient demographics (personal number, name, birthday, gender, contact info)
- View patient history and test results
- Search and filter patients

### Test Configuration

- **Test Categories**: Organize tests into logical categories (e.g., Blood Chemistry, Hematology)
- **Test Panels**: Define test panels with multiple parameters and pricing
- **Test Parameters**: Configure individual test parameters with units and reference ranges
- **Reference Ranges**: Age and gender-specific normal value ranges

### Test Results Management

- Create test results with multiple parameter values
- Automatic status determination (Normal, High, Low) based on reference ranges
- Edit and update test results
- View complete test history by patient
- Generate and download PDF reports for test results

### Dashboard & Analytics

- Role-specific dashboards
- Statistical visualizations (bar charts, line charts, pie charts)
- Revenue tracking and reporting
- Patient and test statistics
- Real-time data insights

### Security Features

- JWT-based authentication
- Protected routes and API endpoints
- Role-based authorization middleware
- Secure password storage
- Email verification for password resets

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Email**: Nodemailer
- **PDF Generation**: PDFKit
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Environment**: dotenv

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Linting**: ESLint

### Development Tools

- **Server**: Nodemon (auto-reload)
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

## ▶️ Running the Application

### Start the Backend Server

```bash
cd server
npm start
```

The server will start on `http://localhost:5000` with auto-reload enabled via nodemon.

### Start the Frontend Development Server

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173` (default Vite port).

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Swagger Docs**: http://localhost:5000/api-docs (if configured)

### Default Users

After running the database setup, you may need to create an initial admin user. You can do this by:

1. Using the registration endpoint with role "ADMIN"
2. Or directly inserting into the database:
   ```sql
   INSERT INTO users (email, password, role, created_at)
   VALUES ('admin@lab.com', '$2b$10$hashedpassword', 'ADMIN', NOW());
   ```

## 👥 User Roles & Permissions

### ADMIN

- Full system access
- Manage users (create, update, delete)
- Manage patients (create, update, delete)
- Manage test configurations (categories, panels, parameters)
- Create and edit test results
- View all dashboards and analytics
- Revenue tracking

### LABORANT

- Manage patients (create, update)
- Manage test configurations (categories, panels, parameters)
- Create and edit test results
- View patient test history
- Generate test result reports
- Access laborant dashboard

### DOCTOR

- View patient information (read-only)
- View test results (read-only)
- Download test result reports
- Access doctor dashboard

---

# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **ADMIN**: Full system access, can manage users, patients, tests, and view revenue
- **LABORANT**: Can manage patients, create/edit test results, manage test configurations
- **DOCTOR**: Can view patients and test results (read-only access)

---

## Authentication & Users

### Register User

Creates a new user account.

**Endpoint:** `POST /auth/register`

**Authorization:** None

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "DOCTOR"
}
```

**Response:** `201 Created`

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "DOCTOR"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login

Authenticates a user and returns a JWT token.

**Endpoint:** `POST /auth/login`

**Authorization:** None

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "DOCTOR"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Request Password Reset OTP

Sends a password reset OTP to the user's email.

**Endpoint:** `POST /auth/reset-otp`

**Authorization:** None

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

```json
{
  "message": "Password reset email sent"
}
```

---

### Reset Password

Resets user password using OTP.

**Endpoint:** `POST /auth/reset-password`

**Authorization:** None

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response:** `200 OK`

```json
{
  "message": "Password reset successfully"
}
```

---

### Get Current User

Retrieves the authenticated user's information.

**Endpoint:** `GET /auth/me`

**Authorization:** Required (any role)

**Response:** `200 OK`

```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "DOCTOR"
}
```

---

### Get All Users

Retrieves all registered users.

**Endpoint:** `GET /auth`

**Authorization:** Required (ADMIN only)

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "role": "ADMIN",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "email": "doctor@example.com",
    "role": "DOCTOR",
    "created_at": "2024-01-02T00:00:00.000Z"
  }
]
```

---

### Update User

Updates a user's information.

**Endpoint:** `PUT /auth/:id`

**Authorization:** Required (ADMIN only)

**URL Parameters:**

- `id` (integer): User ID

**Request Body:**

```json
{
  "email": "newemail@example.com",
  "role": "LABORANT"
}
```

**Response:** `200 OK`

```json
{
  "id": 2,
  "email": "newemail@example.com",
  "role": "LABORANT",
  "created_at": "2024-01-02T00:00:00.000Z"
}
```

---

### Delete User

Deletes a user account.

**Endpoint:** `DELETE /auth/:id`

**Authorization:** Required (authenticated users can delete themselves, ADMIN can delete any user)

**URL Parameters:**

- `id` (integer): User ID

**Response:** `200 OK`

```json
{
  "message": "User deleted successfully"
}
```

---

## User Profiles

### Create or Update Profile

Creates or updates the authenticated user's profile.

**Endpoint:** `POST /profile`

**Authorization:** Required (any role)

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Experienced laboratory technician"
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Experienced laboratory technician"
}
```

---

### Get Current User Profile

Retrieves the authenticated user's profile.

**Endpoint:** `GET /profile`

**Authorization:** Required (any role)

**Response:** `200 OK`

```json
{
  "id": 1,
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Experienced laboratory technician"
}
```

---

### Get All Profiles

Retrieves all user profiles (admin view).

**Endpoint:** `GET /profile/all`

**Authorization:** Required (ADMIN only)

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "bio": "Experienced laboratory technician",
    "User": {
      "email": "john.doe@example.com",
      "role": "LABORANT"
    }
  }
]
```

---

### Update User Profile (Admin)

Updates any user's profile.

**Endpoint:** `PUT /profile/:id`

**Authorization:** Required (ADMIN only)

**URL Parameters:**

- `id` (integer): Profile ID

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+0987654321"
}
```

**Response:** `200 OK`

```json
{
  "id": 2,
  "userId": 2,
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+0987654321"
}
```

---

## Patients

### Create Patient

Adds a new patient to the system.

**Endpoint:** `POST /patient`

**Authorization:** Required (LABORANT or ADMIN)

**Request Body:**

```json
{
  "personalNumber": "1234567890",
  "firstName": "Alice",
  "lastName": "Johnson",
  "birthday": "1990-05-15",
  "gender": "Female",
  "phone": "+1234567890",
  "email": "alice.johnson@example.com"
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "personalNumber": "1234567890",
  "firstName": "Alice",
  "lastName": "Johnson",
  "birthday": "1990-05-15T00:00:00.000Z",
  "gender": "Female",
  "phone": "+1234567890",
  "email": "alice.johnson@example.com",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

### Get All Patients

Retrieves all patients.

**Endpoint:** `GET /patient`

**Authorization:** Required (any role)

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "personalNumber": "1234567890",
    "firstName": "Alice",
    "lastName": "Johnson",
    "birthday": "1990-05-15T00:00:00.000Z",
    "gender": "Female",
    "phone": "+1234567890",
    "email": "alice.johnson@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Patient by ID

Retrieves a specific patient by ID.

**Endpoint:** `GET /patient/:id`

**Authorization:** Required (any role)

**URL Parameters:**

- `id` (integer): Patient ID

**Response:** `200 OK`

```json
{
  "id": 1,
  "personalNumber": "1234567890",
  "firstName": "Alice",
  "lastName": "Johnson",
  "birthday": "1990-05-15T00:00:00.000Z",
  "gender": "Female",
  "phone": "+1234567890",
  "email": "alice.johnson@example.com",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

### Update Patient

Updates patient information.

**Endpoint:** `PUT /patient/:id`

**Authorization:** Required (LABORANT or ADMIN)

**URL Parameters:**

- `id` (integer): Patient ID

**Request Body:**

```json
{
  "firstName": "Alice",
  "lastName": "Johnson-Smith",
  "phone": "+1234567899",
  "email": "alice.smith@example.com"
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "personalNumber": "1234567890",
  "firstName": "Alice",
  "lastName": "Johnson-Smith",
  "birthday": "1990-05-15T00:00:00.000Z",
  "gender": "Female",
  "phone": "+1234567899",
  "email": "alice.smith@example.com",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

### Delete Patient

Deletes a patient and all associated test results.

**Endpoint:** `DELETE /patient/:id`

**Authorization:** Required (ADMIN only)

**URL Parameters:**

- `id` (integer): Patient ID

**Response:** `200 OK`

```json
{
  "message": "Patient deleted successfully"
}
```

**Note:** This operation cascades and deletes all test results and test result values associated with the patient.

---

## Test Categories

### Create Test Category

Creates a new test category.

**Endpoint:** `POST /categories`

**Authorization:** Required (ADMIN or LABORANT)

**Request Body:**

```json
{
  "name": "Blood Chemistry",
  "description": "Tests related to blood chemistry analysis"
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "name": "Blood Chemistry",
  "description": "Tests related to blood chemistry analysis",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Get All Test Categories

Retrieves all test categories.

**Endpoint:** `GET /categories`

**Authorization:** Required (any role)

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Blood Chemistry",
    "description": "Tests related to blood chemistry analysis",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Test Category by ID

Retrieves a specific test category with its panels.

**Endpoint:** `GET /categories/:id`

**Authorization:** Required (any role)

**URL Parameters:**

- `id` (integer): Category ID

**Response:** `200 OK`

```json
{
  "id": 1,
  "name": "Blood Chemistry",
  "description": "Tests related to blood chemistry analysis",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "TestPanels": [
    {
      "id": 1,
      "name": "Basic Metabolic Panel",
      "price": 50.0
    }
  ]
}
```

---

### Update Test Category

Updates a test category.

**Endpoint:** `PUT /categories/:id`

**Authorization:** Required (ADMIN or LABORANT)

**URL Parameters:**

- `id` (integer): Category ID

**Request Body:**

```json
{
  "name": "Blood Chemistry Analysis",
  "description": "Comprehensive blood chemistry tests"
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "name": "Blood Chemistry Analysis",
  "description": "Comprehensive blood chemistry tests",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Delete Test Category

Deletes a test category.

**Endpoint:** `DELETE /categories/:id`

**Authorization:** Required (ADMIN or LABORANT)

**URL Parameters:**

- `id` (integer): Category ID

**Response:** `200 OK`

```json
{
  "message": "Category deleted successfully"
}
```

---

## Test Panels

### Create Test Panel

Creates a new test panel with parameters.

**Endpoint:** `POST /tests`

**Authorization:** Required (ADMIN or LABORANT)

**Request Body:**

```json
{
  "name": "Complete Blood Count",
  "categoryId": 1,
  "price": 75.0,
  "parameters": [
    {
      "name": "White Blood Cells",
      "unit": "cells/µL",
      "minValue": 4000,
      "maxValue": 11000
    },
    {
      "name": "Red Blood Cells",
      "unit": "cells/µL",
      "minValue": 4500000,
      "maxValue": 5500000
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "name": "Complete Blood Count",
  "categoryId": 1,
  "price": 75.0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "TestParameters": [
    {
      "id": 1,
      "name": "White Blood Cells",
      "unit": "cells/µL"
    },
    {
      "id": 2,
      "name": "Red Blood Cells",
      "unit": "cells/µL"
    }
  ]
}
```

---

### Get All Test Panels

Retrieves all test panels with their parameters.

**Endpoint:** `GET /tests`

**Authorization:** Required (any role)

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Complete Blood Count",
    "categoryId": 1,
    "price": 75.0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "Category": {
      "id": 1,
      "name": "Blood Chemistry"
    },
    "TestParameters": [
      {
        "id": 1,
        "name": "White Blood Cells",
        "unit": "cells/µL"
      }
    ]
  }
]
```

---

### Update Test Panel

Updates a test panel.

**Endpoint:** `PUT /tests/:id`

**Authorization:** Required (ADMIN or LABORANT)

**URL Parameters:**

- `id` (integer): Panel ID

**Request Body:**

```json
{
  "name": "Complete Blood Count (CBC)",
  "price": 80.0
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "name": "Complete Blood Count (CBC)",
  "categoryId": 1,
  "price": 80.0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Delete Test Panel

Deletes a test panel.

**Endpoint:** `DELETE /tests/:id`

**Authorization:** Required (ADMIN or LABORANT)

**URL Parameters:**

- `id` (integer): Panel ID

**Response:** `200 OK`

```json
{
  "message": "Test panel deleted successfully"
}
```

---

## Test Parameters

### Create Test Parameter

Creates a new test parameter with reference ranges.

**Endpoint:** `POST /parameters`

**Authorization:** Required (ADMIN or LABORANT)

**Request Body:**

```json
{
  "name": "Hemoglobin",
  "unit": "g/dL",
  "panelId": 1,
  "referenceRanges": [
    {
      "gender": "Male",
      "minAge": 18,
      "maxAge": 120,
      "minValue": 13.5,
      "maxValue": 17.5
    },
    {
      "gender": "Female",
      "minAge": 18,
      "maxAge": 120,
      "minValue": 12.0,
      "maxValue": 15.5
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "name": "Hemoglobin",
  "unit": "g/dL",
  "panelId": 1,
  "ReferenceRanges": [
    {
      "id": 1,
      "gender": "Male",
      "minAge": 18,
      "maxAge": 120,
      "minValue": 13.5,
      "maxValue": 17.5
    },
    {
      "id": 2,
      "gender": "Female",
      "minAge": 18,
      "maxAge": 120,
      "minValue": 12.0,
      "maxValue": 15.5
    }
  ]
}
```

---

### Get Test Parameter by ID

Retrieves a specific test parameter with reference ranges.

**Endpoint:** `GET /parameters/:id`

**Authorization:** Required (any role)

**URL Parameters:**

- `id` (integer): Parameter ID

**Response:** `200 OK`

```json
{
  "id": 1,
  "name": "Hemoglobin",
  "unit": "g/dL",
  "panelId": 1,
  "ReferenceRanges": [
    {
      "id": 1,
      "gender": "Male",
      "minAge": 18,
      "maxAge": 120,
      "minValue": 13.5,
      "maxValue": 17.5
    }
  ]
}
```

---

### Update Test Parameter

Updates a test parameter and its reference ranges.

**Endpoint:** `PUT /parameters/:id`

**Authorization:** Required (ADMIN or LABORANT)

**URL Parameters:**

- `id` (integer): Parameter ID

**Request Body:**

```json
{
  "name": "Hemoglobin (Hb)",
  "unit": "g/dL",
  "referenceRanges": [
    {
      "gender": "Male",
      "minAge": 18,
      "maxAge": 120,
      "minValue": 13.8,
      "maxValue": 17.2
    }
  ]
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "name": "Hemoglobin (Hb)",
  "unit": "g/dL",
  "panelId": 1,
  "ReferenceRanges": [
    {
      "id": 3,
      "gender": "Male",
      "minAge": 18,
      "maxAge": 120,
      "minValue": 13.8,
      "maxValue": 17.2
    }
  ]
}
```

---

### Delete Test Parameter

Deletes a test parameter.

**Endpoint:** `DELETE /parameters/:id`

**Authorization:** Required (ADMIN or LABORANT)

**URL Parameters:**

- `id` (integer): Parameter ID

**Response:** `200 OK`

```json
{
  "message": "Parameter deleted successfully"
}
```

---

## Test Results

### Create Test Result

Creates a new test result for a patient.

**Endpoint:** `POST /test-results`

**Authorization:** Required (LABORANT or ADMIN)

**Request Body:**

```json
{
  "patientId": 1,
  "panelId": 1,
  "values": [
    {
      "parameterId": 1,
      "value": 14.5,
      "status": "Normal"
    },
    {
      "parameterId": 2,
      "value": 5200000,
      "status": "Normal"
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "patientId": 1,
  "panelId": 1,
  "testDate": "2024-01-01T00:00:00.000Z",
  "status": "Completed",
  "TestResultValues": [
    {
      "id": 1,
      "testResultId": 1,
      "parameterId": 1,
      "value": 14.5,
      "status": "Normal"
    }
  ]
}
```

---

### Get All Test Results

Retrieves all test results with patient and panel information.

**Endpoint:** `GET /test-results`

**Authorization:** Required (any role)

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "patientId": 1,
    "panelId": 1,
    "testDate": "2024-01-01T00:00:00.000Z",
    "status": "Completed",
    "Patient": {
      "id": 1,
      "firstName": "Alice",
      "lastName": "Johnson"
    },
    "TestPanel": {
      "id": 1,
      "name": "Complete Blood Count",
      "price": 75.0
    },
    "TestResultValues": [
      {
        "id": 1,
        "value": 14.5,
        "status": "Normal",
        "TestParameter": {
          "id": 1,
          "name": "Hemoglobin",
          "unit": "g/dL"
        }
      }
    ]
  }
]
```

---

### Get Test Results by Patient

Retrieves all test results for a specific patient.

**Endpoint:** `GET /test-results/patient/:patientId`

**Authorization:** Required (any role)

**URL Parameters:**

- `patientId` (integer): Patient ID

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "patientId": 1,
    "panelId": 1,
    "testDate": "2024-01-01T00:00:00.000Z",
    "status": "Completed",
    "TestPanel": {
      "id": 1,
      "name": "Complete Blood Count"
    },
    "TestResultValues": [
      {
        "id": 1,
        "value": 14.5,
        "status": "Normal"
      }
    ]
  }
]
```

---

### Get Test Result by ID

Retrieves a specific test result with complete details.

**Endpoint:** `GET /test-results/:id`

**Authorization:** Required (any role)

**URL Parameters:**

- `id` (integer): Test Result ID

**Response:** `200 OK`

```json
{
  "id": 1,
  "patientId": 1,
  "panelId": 1,
  "testDate": "2024-01-01T00:00:00.000Z",
  "status": "Completed",
  "Patient": {
    "id": 1,
    "personalNumber": "1234567890",
    "firstName": "Alice",
    "lastName": "Johnson",
    "birthday": "1990-05-15T00:00:00.000Z",
    "gender": "Female",
    "phone": "+1234567890",
    "email": "alice.johnson@example.com"
  },
  "TestPanel": {
    "id": 1,
    "name": "Complete Blood Count",
    "price": 75.0,
    "Category": {
      "id": 1,
      "name": "Blood Chemistry"
    }
  },
  "TestResultValues": [
    {
      "id": 1,
      "value": 14.5,
      "status": "Normal",
      "TestParameter": {
        "id": 1,
        "name": "Hemoglobin",
        "unit": "g/dL",
        "ReferenceRanges": [
          {
            "gender": "Female",
            "minAge": 18,
            "maxAge": 120,
            "minValue": 12.0,
            "maxValue": 15.5
          }
        ]
      }
    }
  ]
}
```

---

### Update Test Result

Updates test result values.

**Endpoint:** `PUT /test-results/:id`

**Authorization:** Required (LABORANT or ADMIN)

**URL Parameters:**

- `id` (integer): Test Result ID

**Request Body:**

```json
{
  "values": [
    {
      "parameterId": 1,
      "value": 14.8,
      "status": "Normal"
    },
    {
      "parameterId": 2,
      "value": 5300000,
      "status": "Normal"
    }
  ]
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "patientId": 1,
  "panelId": 1,
  "testDate": "2024-01-01T00:00:00.000Z",
  "status": "Completed",
  "TestResultValues": [
    {
      "id": 1,
      "value": 14.8,
      "status": "Normal"
    }
  ]
}
```

---

### Delete Test Result

Deletes a test result and all associated values.

**Endpoint:** `DELETE /test-results/:id`

**Authorization:** Required (LABORANT or ADMIN)

**URL Parameters:**

- `id` (integer): Test Result ID

**Response:** `200 OK`

```json
{
  "message": "Test result deleted successfully"
}
```

---

### Download Test Result Report

Generates and downloads a PDF report for a test result.

**Endpoint:** `GET /test-results/:id/download`

**Authorization:** Required (any role)

**URL Parameters:**

- `id` (integer): Test Result ID

**Response:** `200 OK`

- Content-Type: `application/pdf`
- Binary PDF data
