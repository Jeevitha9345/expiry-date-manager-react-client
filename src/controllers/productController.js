const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const productService = require('../services/productService');

const checkDBConnection = (response) => {
    if (mongoose.connection.readyState !== 1) {
        response.status(503).json({
            message: 'Database connection is not active. Please ensure MongoDB service is running on mongodb://127.0.0.1:27017'
        });
        return false;
    }
    return true;
};

const productController = {
    getProducts: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }

            const userId = request.user._id;
            const { page, limit, search, expiryFilter } = request.query;

            const result = await productService.getPaginatedProducts({
                userId,
                page,
                limit,
                search,
                expiryFilter
            });

            return response.status(200).json({
                success: true,
                message: 'Products retrieved successfully',
                data: result
            });
        } catch (error) {
            console.error('Get Products Error:', error);
            return response.status(500).json({
                message: 'Internal server error',
                details: error.message
            });
        }
    },

    getProductById: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const userId = request.user._id;
            const productId = request.params.id;

            const product = await productService.getProductById(productId, userId);
            if (!product) {
                return response.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            return response.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            console.error('Get Product By ID Error:', error);
            return response.status(500).json({
                message: 'Internal server error',
                details: error.message
            });
        }
    },

    createProduct: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }

            const userId = request.user._id;
            const { upcCode, title, amount, expiryDate } = request.body;

            const newProduct = await productService.addProduct(userId, {
                upcCode,
                title,
                amount,
                expiryDate
            });

            return response.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: newProduct
            });
        } catch (error) {
            console.error('Create Product Error:', error);
            return response.status(500).json({
                message: 'Internal server error',
                details: error.message
            });
        }
    },

    updateProduct: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }

            const userId = request.user._id;
            const productId = request.params.id;
            const { upcCode, title, amount, expiryDate } = request.body;

            const updatedProduct = await productService.updateProduct(productId, userId, {
                upcCode,
                title,
                amount,
                expiryDate
            });

            if (!updatedProduct) {
                return response.status(404).json({
                    success: false,
                    message: 'Product not found or access denied'
                });
            }

            return response.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: updatedProduct
            });
        } catch (error) {
            console.error('Update Product Error:', error);
            return response.status(500).json({
                message: 'Internal server error',
                details: error.message
            });
        }
    },

    deleteProduct: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const userId = request.user._id;
            const productId = request.params.id;

            const deletedProduct = await productService.deleteProduct(productId, userId);
            if (!deletedProduct) {
                return response.status(404).json({
                    success: false,
                    message: 'Product not found or access denied'
                });
            }

            return response.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            console.error('Delete Product Error:', error);
            return response.status(500).json({
                message: 'Internal server error',
                details: error.message
            });
        }
    },

    lookupUpc: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const userId = request.user._id;
            const upcCode = request.params.upcCode;

            const result = await productService.lookupUpc(upcCode, userId);
            return response.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Lookup UPC Error:', error);
            return response.status(500).json({
                message: 'Internal server error',
                details: error.message
            });
        }
    }
};

module.exports = productController;
