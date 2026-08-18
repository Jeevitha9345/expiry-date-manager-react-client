const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply auth protection to all product routes
router.use(authMiddleware.protect);

const productValidators = [
    body('title').trim().notEmpty().withMessage('Product title is required'),
    body('amount.value').isNumeric().withMessage('Amount value must be a number'),
    body('amount.currency').notEmpty().withMessage('Amount currency is required'),
    body('expiryDate').isISO8601().withMessage('Valid expiry date is required')
];

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Retrieve products list with pagination and search
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: expiryFilter
 *         schema:
 *           type: string
 *           enum: [all, expired, expiring_soon, fresh]
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get('/', productController.getProducts);

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
 *     responses:
 *       200:
 *         description: Product details retrieved
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product entry
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/', productValidators, productController.createProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put('/:id', productValidators, productController.updateProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete('/:id', productController.deleteProduct);

/**
 * @swagger
 * /api/v1/products/lookup/{upcCode}:
 *   get:
 *     summary: Lookup product by UPC barcode
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Product found by UPC
 */
router.get('/lookup/:upcCode', productController.lookupUpc);

module.exports = router;
