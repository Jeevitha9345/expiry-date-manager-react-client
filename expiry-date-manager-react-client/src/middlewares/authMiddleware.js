const jwt = require('jsonwebtoken');

const authMiddleware = {
    protect: async (request, response, next) => {
        try {
            const token = request.cookies?.jwtToken;

            if (!token) {
                return response.status(401).json({
                    error: 'Unauthorized access'
                });
            }

            try {
                const user = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_expiry_manager_2026');
                request.user = user;
                next();
            } catch (error) {
                return response.status(401).json({
                    error: 'Unauthorized access'
                });
            }

        } catch (error) {
            console.error(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
};

module.exports = authMiddleware;
