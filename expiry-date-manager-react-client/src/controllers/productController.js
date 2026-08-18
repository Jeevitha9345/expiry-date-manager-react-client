const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const productDao = require('../dao/productDao');

const checkDBConnection = (response) => {
    if (mongoose.connection.readyState !== 1) {
        response.status(503).json({
            message: 'Database connection is not active. Please check database server and MONGO_URI configuration.'
        });
        return false;
    }
    return true;
};

const productController = {
    getProducts: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const { page = 1, limit = 20, search = '', expiryFilter = 'all' } = request.query;
            const userId = request.user._id;

            const result = await productDao.findProducts({
                userId,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                search,
                expiryFilter
            });

            return response.status(200).json(result);
        } catch (error) {
            console.error('Get Products Error:', error);
            return response.status(500).json({ message: 'Internal server error', details: error.message });
        }
    },

    getProductById: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const { id } = request.params;
            const userId = request.user._id;

            const product = await productDao.findById(id, userId);
            if (!product) {
                return response.status(404).json({ message: 'Product not found' });
            }

            return response.status(200).json({ product });
        } catch (error) {
            console.error('Get Product By ID Error:', error);
            return response.status(500).json({ message: 'Internal server error', details: error.message });
        }
    },

    createProduct: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }

            const { title, upcCode, amount, expiryDate } = request.body;
            const userId = request.user._id;

            const product = await productDao.createProduct({
                userId,
                title,
                upcCode,
                amount,
                expiryDate
            });

            return response.status(201).json({
                message: 'Product created successfully',
                product
            });
        } catch (error) {
            console.error('Create Product Error:', error);
            return response.status(500).json({ message: 'Internal server error', details: error.message });
        }
    },

    updateProduct: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }

            const { id } = request.params;
            const { title, upcCode, amount, expiryDate } = request.body;
            const userId = request.user._id;

            const updatedProduct = await productDao.updateProduct(id, userId, {
                title,
                upcCode,
                amount,
                expiryDate
            });

            if (!updatedProduct) {
                return response.status(404).json({ message: 'Product not found' });
            }

            return response.status(200).json({
                message: 'Product updated successfully',
                product: updatedProduct
            });
        } catch (error) {
            console.error('Update Product Error:', error);
            return response.status(500).json({ message: 'Internal server error', details: error.message });
        }
    },

    deleteProduct: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const { id } = request.params;
            const userId = request.user._id;

            const deletedProduct = await productDao.deleteProduct(id, userId);
            if (!deletedProduct) {
                return response.status(404).json({ message: 'Product not found' });
            }

            return response.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Delete Product Error:', error);
            return response.status(500).json({ message: 'Internal server error', details: error.message });
        }
    },

    lookupUpc: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

            const { upcCode } = request.params;
            const userId = request.user._id;

            const product = await productDao.findByUpcCode(upcCode, userId);
            if (!product) {
                return response.status(404).json({ message: 'No product found with this UPC code' });
            }

            return response.status(200).json({ product });
        } catch (error) {
            console.error('Lookup UPC Error:', error);
            return response.status(500).json({ message: 'Internal server error', details: error.message });
        }
    }
};

module.exports = productController;
