const Product = require('../models/Product');

const productDao = {
    findProducts: async ({ userId, page = 1, limit = 20, search = '', expiryFilter = 'all' }) => {
        const query = { userId };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const now = new Date();
        if (expiryFilter === 'expired') {
            query.expiryDate = { $lt: now };
        } else if (expiryFilter === 'expiring_soon') {
            const sevenDaysLater = new Date();
            sevenDaysLater.setDate(now.getDate() + 7);
            query.expiryDate = { $gte: now, $lte: sevenDaysLater };
        } else if (expiryFilter === 'fresh') {
            const sevenDaysLater = new Date();
            sevenDaysLater.setDate(now.getDate() + 7);
            query.expiryDate = { $gt: sevenDaysLater };
        }

        const skip = (page - 1) * limit;

        const [products, totalItems] = await Promise.all([
            Product.find(query).sort({ expiryDate: 1 }).skip(skip).limit(limit).exec(),
            Product.countDocuments(query)
        ]);

        return {
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalItems,
                totalPages: Math.ceil(totalItems / limit) || 1
            }
        };
    },

    findById: async (id, userId) => {
        return await Product.findOne({ _id: id, userId });
    },

    createProduct: async (productData) => {
        const product = new Product(productData);
        return await product.save();
    },

    updateProduct: async (id, userId, productData) => {
        return await Product.findOneAndUpdate(
            { _id: id, userId },
            { $set: productData },
            { new: true, runValidators: true }
        );
    },

    deleteProduct: async (id, userId) => {
        return await Product.findOneAndDelete({ _id: id, userId });
    },

    findByUpcCode: async (upcCode, userId) => {
        return await Product.findOne({ upcCode, userId });
    }
};

module.exports = productDao;
