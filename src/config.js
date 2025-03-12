import dotenv from 'dotenv';
import path from 'path';

// Map your specific NODE_ENV values to the correct .env files
const envMapping = {
    prod: '.env.prod',
    test: '.env.test',
    dev: '.env.dev',  // Matches your "dev" instead of "development"
};

// Ensure NODE_ENV is always recognized
const envKey = process.env.NODE_ENV || 'dev';  // Default to 'dev' if missing
const envFile = envMapping[envKey] || '.env';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const config = {
    env: envKey,  // Now it correctly reflects 'dev', 'test', or 'prod'
    port: process.env.PORT,  // Automatically loads the port from the selected .env file
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS
};

export default config;
