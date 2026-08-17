const express = require('express');
const { body, query, param } = require('express-validator');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply JWT Authentication protection middleware to all product routes
router.use(authMiddleware.protect);

// Validators
const createProductValidators = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('amount.value').isNumeric().withMessage('Amount value must be a valid number'),
    body('amount.currency').trim().notEmpty().withMessage('Amount currency is required'),
    body('expiryDate').isISO8601().withMessage('Valid ISO 8601 expiry date is required'),
    body('upcCode').optional().trim()
];

const updateProductValidators = [
    param('id').isMongoId().withMessage('Invalid product ID format'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('amount.value').optional().isNumeric().withMessage('Amount value must be a number'),
    body('amount.currency').optional().trim().notEmpty().withMessage('Amount currency cannot be empty'),
    body('expiryDate').optional().isISO8601().withMessage('Valid ISO 8601 expiry date is required'),
    body('upcCode').optional().trim()
];

const getProductsValidators = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20'),
    query('search').optional().trim(),
    query('expiryFilter').optional().isIn(['1month', '3months', 'expired', 'all']).withMessage('Invalid expiry filter value')
];

const mongoIdParamValidator = [
    param('id').isMongoId().withMessage('Invalid product ID format')
];

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Retrieve paginated products with search & date range filters
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of products to return (max 20)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword matching product title or UPC barcode
 *       - in: query
 *         name: expiryFilter
 *         schema:
 *           type: string
 *           enum: [1month, 3months, expired, all]
 *         description: Filter products by expiration threshold
 *     responses:
 *       200:
 *         description: Paginated list of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProductsResponse'
 *       401:
 *         description: Unauthorized access - JWT cookie missing or invalid
 */
router.get('/', getProductsValidators, productController.getProducts);

/**
 * @swagger
 * /api/v1/products/lookup/{upcCode}:
 *   get:
 *     summary: Quick lookup product title & details by UPC barcode
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: upcCode
 *         required: true
 *         schema:
 *           type: string
 *         description: UPC barcode string to search for existing product template
 *     responses:
 *       200:
 *         description: UPC lookup result
 */
router.get('/lookup/:upcCode', productController.lookupUpc);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get single product by ID
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', mongoIdParamValidator, productController.getProductById);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product (manual entry or UPC scan)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', createProductValidators, productController.createProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update an existing product by ID
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found or access denied
 */
router.put('/:id', updateProductValidators, productController.updateProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found or access denied
 */
router.delete('/:id', mongoIdParamValidator, productController.deleteProduct);

module.exports = router;
