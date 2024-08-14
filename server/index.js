import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  HashPassword,
  ComparePassword,
  DecryptToken,
  GenerateTokens,
} from './lib/AppHelper.js';

import UserModel from './models/users.js';
import globaErrors from './middlewares/globalError.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
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
  try {
    const { name, email, password } = req.body;

    if (name.length < 2 || email.length < 6 || password.length < 8) {
      return res.status(400).json({
        message: 'Bad request passed !',
      });
    }

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

    const GetBadRequestResponse = (res) => {
      return res
        .status(400)
        .json({ message: 'Error : bad email or password !' });
    };

    if (email.length < 5 || password.length < 8) {
      return GetBadRequestResponse(res);
    }

    var user = await UserModel.findOne({ email: email });
    if (!user) {
      return GetBadRequestResponse(res);
    }

    var isValidPassword = await ComparePassword(password, user.password);
    if (!isValidPassword) {
      return GetBadRequestResponse(res);
    }

    const tokens = GenerateTokens({ email: user.email, name: user.name });
    res.status(200).json({
      message: 'Login sucess !',
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
});

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return await refreshToken(req, res, next);
  }
  DecryptToken(token, process.env.TOKEN_KEY, async (err, decodedValue) => {
    if (err) {
      console.log(err);
      return await refreshToken(req, res, next);
    }
    res.locals.email = decodedValue.email;
    next();
  });
};

const refreshToken = async (req, res, next) => {
  const UnAuthorizedResponse = (res) => {
    res.status(401).json({ message: 'Error : Unauthorized user !' });
  };

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return UnAuthorizedResponse(res);
  }

  DecryptToken(
    refreshToken,
    process.env.REFRESH_TOKEN_KEY,
    (err, decodedValue) => {
      if (err) {
        console.log(err);
        return UnAuthorizedResponse(res);
      }
      res.locals.email = decodedValue.email;
      res.set(
        GenerateTokens({
          email: decodedValue.email,
          name: decodedValue.name,
        })
      );
      next();
    }
  );
};

/**
 * Get client information by authentification cookies
 */
app.get('/get/me', authenticateUser, async (req, res, next) => {
  var user = await UserModel.findOne({
    email: res.locals.email,
  });
  user.password = undefined;

  res.json(user);
});

app.get('/', authenticateUser, (req, res) => {
  res.status(200).send('Hello World');
});

app.use(globaErrors);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.error(
    `server-auth is running on port : ${PORT} \n open on : http://127.0.0.1:${PORT}`
  );
});
