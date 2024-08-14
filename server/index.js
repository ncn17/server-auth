import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { HashPassword, ComparePassword, CreateToken } from './lib/AppHelper.js';
import UserModel from './models/users.js';
import globaErrors from './middlewares/globalError.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
mongoose.connect(process.env.DATABASE_URL);
app.use(
  cors({
    origin: [process.env.CLIENT_ORIGN],
    credentials: true,
  })
);

// routes

/**
 * Create or register a new user on database
 */
app.post('/user/create', async (req, res, next) => {
  const { name, email, password } = req.body;

  if (name.length < 2 || email.length < 6 || password.length < 8) {
    return res.status(400).json({
      message: 'Bad request passed !',
    });
  }

  try {
    var user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(400).send({
        message: 'User email already used !',
      });
    }

    var hashedPassword = await HashPassword(password);
    await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).send({
      message: 'User created succesfully !',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * SignUp auth user and get credentials
 */
app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email.length < 5 || password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Error : bad email or password !' });
    }

    var user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Error : bad email or password !' });
    }

    var isValidPassword = await ComparePassword(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: 'Error : bad email or password !' });
    }

    const data = { email: user.email, name: user.name };

    res.status(200).json({
      message: 'Login sucess !',
      token: CreateToken(data, process.env.TOKEN_KEY, '15m'),
      refreshToken: CreateToken(data, process.env.REFRESH_TOKEN_KEY, '30d'),
    });
  } catch (error) {
    next(error);
  }
});

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

app.use(globaErrors);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.error(
    `server-auth is running on port : ${PORT} \n open on : http://127.0.0.1:${PORT}`
  );
});
