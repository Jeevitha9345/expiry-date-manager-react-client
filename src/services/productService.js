const productDao = require('../dao/productDao');

const productService = {
    getPaginatedProducts: async ({ userId, page = 1, limit = 20, search, expiryFilter }) => {
        const parsedPage = Math.max(1, parseInt(page, 10) || 1);
        const parsedLimit = Math.min(20, Math.max(1, parseInt(limit, 10) || 20));
        const skip = (parsedPage - 1) * parsedLimit;

        const query = { userId };

        // Expiry Date Range Filter
        const now = new Date();
        if (expiryFilter === '1month') {
            const nextMonth = new Date();
            nextMonth.setDate(nextMonth.getDate() + 30);
            query.expiryDate = { $gte: now, $lte: nextMonth };
        } else if (expiryFilter === '3months') {
            const next3Months = new Date();
            next3Months.setDate(next3Months.getDate() + 90);
            query.expiryDate = { $gte: now, $lte: next3Months };
        } else if (expiryFilter === 'expired') {
            query.expiryDate = { $lt: now };
        }

        // Search by title or UPC code
        if (search && search.trim() !== '') {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: regex },
                { upcCode: regex }
            ];
        }

        const [products, totalItems] = await Promise.all([
            productDao.find(query, { expiryDate: 1 }, skip, parsedLimit),
            productDao.count(query)
        ]);

        const totalPages = Math.ceil(totalItems / parsedLimit) || 1;

        return {
            products,
            pagination: {
                currentPage: parsedPage,
                totalPages,
                pageSize: parsedLimit,
                totalItems,
                hasNextPage: parsedPage < totalPages,
                hasPrevPage: parsedPage > 1
            }
        };
    },

    addProduct: async (userId, productData) => {
        return await productDao.create({
            userId,
            upcCode: productData.upcCode || '',
            title: productData.title,
            amount: productData.amount,
            expiryDate: new Date(productData.expiryDate)
        });
    },

    getProductById: async (productId, userId) => {
        return await productDao.findById(productId, userId);
    },

    updateProduct: async (productId, userId, updateData) => {
        const payload = {};
        if (updateData.upcCode !== undefined) payload.upcCode = updateData.upcCode;
        if (updateData.title !== undefined) payload.title = updateData.title;
        if (updateData.amount !== undefined) payload.amount = updateData.amount;
        if (updateData.expiryDate !== undefined) payload.expiryDate = new Date(updateData.expiryDate);

        return await productDao.update(productId, userId, payload);
    },

    deleteProduct: async (productId, userId) => {
        return await productDao.delete(productId, userId);
    },

    lookupUpc: async (upcCode, userId) => {
        const product = await productDao.findLatestByUpc(upcCode, userId);
        if (!product) {
            return { upcCode, found: false };
        }
        return {
            upcCode: product.upcCode,
            title: product.title,
            amount: product.amount,
            found: true
        };
    }
};

module.exports = productService;
