const Product = require('../models/Product');

const productDao = {
    create: async (productData) => {
        return await Product.create(productData);
    },

    findById: async (productId, userId) => {
        return await Product.findOne({ _id: productId, userId });
    },

    find: async (query, sort = { expiryDate: 1 }, skip = 0, limit = 20) => {
        return await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
    },

    count: async (query) => {
        return await Product.countDocuments(query);
    },

    update: async (productId, userId, updateData) => {
        return await Product.findOneAndUpdate(
            { _id: productId, userId },
            updateData,
            { new: true, runValidators: true }
        );
    },

    delete: async (productId, userId) => {
        return await Product.findOneAndDelete({ _id: productId, userId });
    },

    findLatestByUpc: async (upcCode, userId) => {
        return await Product.findOne({ upcCode, userId }).sort({ createdAt: -1 }).lean();
    }
};

module.exports = productDao;
