import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Creators Platform API is running',
    health: '/api/health',
  });
});

app.use('/api', healthRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
