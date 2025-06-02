import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import transactionRoutes from './routes/transactions.js';
import cors from 'cors'
dotenv.config();
const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));