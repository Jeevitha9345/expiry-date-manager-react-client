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

// Trust proxy for deployment on platforms like Render (enables HTTPS cookie detection behind reverse proxies)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Parse CLIENT_URL (supports single or comma-separated origins)
const configuredOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(url => url.trim())
    : [];

const allowedOrigins = [
    ...configuredOrigins,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
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

// Root Welcome Endpoint
app.get('/', (req, res) => {
    const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
    res.status(200).json({
        name: 'Expiry Date Manager REST API',
        status: 'UP',
        version: '1.0.0',
        documentation: `${baseUrl}/api-docs`,
        healthCheck: `${baseUrl}/api/health`,
        endpoints: {
            auth: `${baseUrl}/auth`,
            products: `${baseUrl}/api/v1/products`
        }
    });
});

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
    const baseUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger Documentation available at ${baseUrl}/api-docs`);
});
