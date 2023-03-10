import {
  getUserData,
  logout,
  signin,
  signup,
} from '../controllers/auth.controller';
import { Router } from 'express';

class AuthRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post('/api/auth/signup', signup);
    this.router.post('/api/auth/signin', signin);
    this.router.get('/api/auth/getUserData', getUserData);
    this.router.route('/api/auth/logout').get(logout);
  }

  public getRouter() {
    return this.router;
  }
}

export const router = new AuthRouter().getRouter();
