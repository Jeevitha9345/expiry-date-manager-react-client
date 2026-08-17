const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');

const ADMIN_ROLE = 'ADMIN';

const checkDBConnection = (response) => {
    if (mongoose.connection.readyState !== 1) {
        response.status(503).json({
            message: 'Database connection is not active. Please ensure MongoDB service is running on mongodb://127.0.0.1:27017'
        });
        return false;
    }
    return true;
};

const authController = {
    register: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

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
                message: 'Internal server error',
                details: error.message
            });
        }
    },

    login: async (request, response) => {
        try {
            if (!checkDBConnection(response)) return;

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
                message: 'Internal server error',
                details: error.message
            });
        }
    },

    logout: async (request, response) => {
        try {
            response.clearCookie('jwtToken', {
                httpOnly: true,
                domain: 'localhost',
                path: '/'
            });
            return response.status(200).json({
                message: 'Logged out successfully'
            });
        } catch (error) {
            return response.status(500).json({ message: 'Logout failed', details: error.message });
        }
    },

    getMe: async (request, response) => {
        try {
            if (!request.user) {
                return response.status(401).json({ message: 'Not authenticated' });
            }
            return response.status(200).json({
                user: {
                    _id: request.user._id,
                    name: request.user.name,
                    email: request.user.email,
                    role: request.user.role,
                    adminId: request.user.adminId
                }
            });
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = authController;

