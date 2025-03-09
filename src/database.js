import dotenv from 'dotenv';
import mongoose from 'mongoose';
import config from './config.js'; // Importamos la configuración de entornos

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
      }
    });
    console.log(`✅ Conectado exitosamente a MongoDB en modo ${config.env}`);
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
