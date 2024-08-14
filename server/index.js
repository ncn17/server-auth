import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import CreateToken from './lib/tokenHelper.js';
import UserModel from './models/users.js';

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

// configuration
const PORT = process.env.PORT;
const ACCESS_TOKEN_KEY = 'access-token-key-xclerc@1710';
const REFRESH_TOKEN_KEY = 'refresh-token-key-xclerc@1710';
const ACCESS_TOKEN = 'auth_token';
const REFRESH_TOKEN = 'auth_refresh_token';

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

    var hashedPassword = await bcrypt.hash(password, process.env.PASSWORD_SALT);
    var response = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).send({
      message: 'User created succesfully !',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Create user failled : server error',
    });
  }
});

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

app.listen(PORT, () => {
  console.error(
    `server-auth is running on port : ${PORT} \n open on : http://127.0.0.1:${PORT}`
  );
});
