const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');

const ADMIN_ROLE = 'ADMIN';

const authController = {
    register: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    errors: errors.array()
                });
            }

            const { name, email, password } = request.body;

            const existingUser = await userDao.findByEmail(email);
            if (existingUser) {
                return response.status(400).json({
                    message: 'User already exists with this email'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userDao.createUser({
                name,
                email,
                password: hashedPassword,
                role: ADMIN_ROLE
            });

            user.role = user.role ? user.role : ADMIN_ROLE;
            user.adminId = user.adminId ? user.adminId : user._id;

            return response.status(201).json({
                message: 'User registered successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    adminId: user.adminId
                }
            });
        } catch (error) {
            console.error('Registration Error:', error);
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    login: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    errors: errors.array()
                });
            }

            const { email, password } = request.body;

            const user = await userDao.findByEmail(email);

            const isPasswordMatched = await bcrypt.compare(password, user?.password || '');
            if (user && isPasswordMatched) {
                user.role = user.role ? user.role : ADMIN_ROLE;
                user.adminId = user.adminId ? user.adminId : user._id;

                const token = jwt.sign({
                    name: user.name,
                    email: user.email,
                    _id: user._id,
                    role: user.role ? user.role : ADMIN_ROLE,
                    adminId: user.adminId ? user.adminId : user._id,
                }, process.env.JWT_SECRET || 'supersecretjwtkey_expiry_manager_2026',
                    { expiresIn: '1h' }
                );

                response.cookie('jwtToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    domain: 'localhost',
                    path: '/'
                });
                return response.status(200).json({
                    message: 'User authenticated',
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        adminId: user.adminId
                    }
                });
            } else {
                return response.status(400).json({
                    message: 'Invalid email or password'
                });
            }
        } catch (error) {
            console.error('Login Error:', error);
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    }
};

module.exports = authController;
