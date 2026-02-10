import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Laboratory Management System API",
      version: "1.0.0",
      description:
        "A comprehensive API for managing laboratory operations, including patient management, test results, and user authentication.",
      contact: {
        name: "API Support",
        email: "support@labsystem.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            role: {
              type: "string",
              enum: ["ADMIN", "LABORANT", "DOCTOR"],
              description: "User role",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
          },
        },
        Patient: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Patient ID",
            },
            personalNumber: {
              type: "string",
              description: "Personal identification number",
            },
            firstName: {
              type: "string",
              description: "First name",
            },
            lastName: {
              type: "string",
              description: "Last name",
            },
            birthday: {
              type: "string",
              format: "date",
              description: "Date of birth",
            },
            gender: {
              type: "string",
              enum: ["Male", "Female", "Other"],
              description: "Gender",
            },
            phone: {
              type: "string",
              description: "Phone number",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Record creation timestamp",
            },
          },
        },
        TestCategory: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Category ID",
            },
            name: {
              type: "string",
              description: "Category name",
            },
            description: {
              type: "string",
              description: "Category description",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
          },
        },
        TestPanel: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Panel ID",
            },
            name: {
              type: "string",
              description: "Panel name",
            },
            categoryId: {
              type: "integer",
              description: "Associated category ID",
            },
            price: {
              type: "number",
              format: "float",
              description: "Panel price",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
          },
        },
        TestParameter: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Parameter ID",
            },
            name: {
              type: "string",
              description: "Parameter name",
            },
            unit: {
              type: "string",
              description: "Unit of measurement",
            },
            panelId: {
              type: "integer",
              description: "Associated panel ID",
            },
          },
        },
        TestResult: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Test result ID",
            },
            patientId: {
              type: "integer",
              description: "Patient ID",
            },
            panelId: {
              type: "integer",
              description: "Test panel ID",
            },
            testDate: {
              type: "string",
              format: "date-time",
              description: "Test date",
            },
            status: {
              type: "string",
              description: "Result status",
            },
          },
        },
        Profile: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Profile ID",
            },
            userId: {
              type: "integer",
              description: "Associated user ID",
            },
            firstName: {
              type: "string",
              description: "First name",
            },
            lastName: {
              type: "string",
              description: "Last name",
            },
            phone: {
              type: "string",
              description: "Phone number",
            },
            bio: {
              type: "string",
              description: "Biography",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
