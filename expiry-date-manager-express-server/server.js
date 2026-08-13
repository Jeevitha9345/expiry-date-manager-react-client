require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./src/config/db');
const swaggerSpec = require('./src/config/swagger');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Core Middlewares
app.use(cors({
    origin: 'http://localhost:5173', // Vite default React dev server port
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/auth', authRoutes);

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
