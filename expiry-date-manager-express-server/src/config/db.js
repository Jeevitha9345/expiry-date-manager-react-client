const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        let mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expiry-date-manager';

        // Auto-fix common connection string errors: remove placeholder angle brackets < > around password if present
        if (mongoURI.includes('<') || mongoURI.includes('>')) {
            mongoURI = mongoURI.replace(/<([^>]+)>/g, '$1');
        }

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        if (error.message.includes('Invalid connection string')) {
            console.error('TROUBLESHOOTING TIP: Ensure MONGO_URI has no angle brackets < > around password, and encode special characters like "@" as "%40".');
        }
    }
};

module.exports = connectDB;
