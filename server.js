require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./src/config/db');
const swaggerSpec = require('./src/config/swagger');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Core Middlewares
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        // Allow any localhost origin (e.g., http://localhost:5173, http://localhost:5174, http://127.0.0.1:5173)
        if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/products', productRoutes);

// Health Check Endpoint
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Server health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server running cleanly
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Expiry Date Manager Express Server running',
        timestamp: new Date().toISOString()
    });
});

// Fallback 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger Documentation available at http://localhost:${PORT}/api-docs`);
});
