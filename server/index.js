import express, { Router } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import globaErrors from './middlewares/globalError.js';
import InitAppRoutes from './routes/index.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_KEY));
mongoose.connect(process.env.DATABASE_URL);
app.use(
  cors({
    origin: [process.env.CLIENT_ORIGN],
    credentials: true,
    exposedHeaders: 'Token',
  })
);

// set app routes
InitAppRoutes(app);
// errors catch
app.use(globaErrors);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.error(
    `server-auth is running on port : ${PORT} \n open on : http://127.0.0.1:${PORT}`
  );
});
