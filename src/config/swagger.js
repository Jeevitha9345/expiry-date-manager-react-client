const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Expiry Date Manager REST API',
            version: '1.0.0',
            description: 'API documentation for Expiry Date Manager Node.js/Express backend server'
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'jwtToken'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '65c7a1e2f9d8a123456789ab' },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        role: { type: 'string', example: 'ADMIN' },
                        adminId: { type: 'string', example: '65c7a1e2f9d8a123456789ab' }
                    }
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        password: { type: 'string', example: 'secret123' }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'john@example.com' },
                        password: { type: 'string', example: 'secret123' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'User authenticated' },
                        user: { $ref: '#/components/schemas/User' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Invalid email or password' },
                        errors: { type: 'array', items: { type: 'object' } }
                    }
                },
                Amount: {
                    type: 'object',
                    required: ['value', 'currency'],
                    properties: {
                        value: { type: 'number', example: 2 },
                        currency: { type: 'string', example: 'USD' }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
                        userId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d0' },
                        upcCode: { type: 'string', example: '012345678905' },
                        title: { type: 'string', example: 'Whole Milk 1L' },
                        amount: { $ref: '#/components/schemas/Amount' },
                        expiryDate: { type: 'string', format: 'date-time', example: '2026-08-25T00:00:00.000Z' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                CreateProductRequest: {
                    type: 'object',
                    required: ['title', 'amount', 'expiryDate'],
                    properties: {
                        upcCode: { type: 'string', example: '012345678905' },
                        title: { type: 'string', example: 'Whole Milk 1L' },
                        amount: { $ref: '#/components/schemas/Amount' },
                        expiryDate: { type: 'string', format: 'date-time', example: '2026-08-25' }
                    }
                },
                UpdateProductRequest: {
                    type: 'object',
                    properties: {
                        upcCode: { type: 'string', example: '012345678905' },
                        title: { type: 'string', example: 'Whole Milk 1L (Organic)' },
                        amount: { $ref: '#/components/schemas/Amount' },
                        expiryDate: { type: 'string', format: 'date-time', example: '2026-08-30' }
                    }
                },
                PaginatedProductsResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Products retrieved successfully' },
                        data: {
                            type: 'object',
                            properties: {
                                products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                                pagination: {
                                    type: 'object',
                                    properties: {
                                        currentPage: { type: 'number', example: 1 },
                                        totalPages: { type: 'number', example: 5 },
                                        pageSize: { type: 'number', example: 20 },
                                        totalItems: { type: 'number', example: 95 },
                                        hasNextPage: { type: 'boolean', example: true },
                                        hasPrevPage: { type: 'boolean', example: false }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js', './server.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
