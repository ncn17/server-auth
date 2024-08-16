import { Router } from 'express';
import Register from './register.js';
import { AuthenticateUser, RefreshToken } from './authentification.js';
import Identity from './identity.js';
import Login from './login.js';

const InitAppRoutes = (app) => {
  /**
   * Config all api routes
   */
  const MainUseRouter = Router();

  MainUseRouter.route('/user/create').post(Register);
  MainUseRouter.post('/login', Login);
  MainUseRouter.get('/get/me', AuthenticateUser, Identity);
  MainUseRouter.get('/refresh-token', RefreshToken);

  /**
   * Default Home endpoint
   */
  app.get('/', (req, res) => {
    res.status(200).send('<h1>Hello World !</h1>');
  });

  app.use('/api/', MainUseRouter);
};

export default InitAppRoutes;
