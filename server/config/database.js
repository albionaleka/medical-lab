import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  port: Number(DB_PORT),
  logging: false,
  define: {
    timestamps: false
  }
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default sequelize;