const User = require('../models/users');

const userDao = {
    findByEmail: async (email) => {
        const user = await User.findOne({ email });
        return user;
    },
    createUser: async (userData) => {
        const user = new User(userData);
        return await user.save();
    },
    findById: async (id) => {
        const user = await User.findById(id);
        return user;
    }
};

module.exports = userDao;
